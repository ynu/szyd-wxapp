const {
  ecardApi,
  zqApi,
  fcApi,
  uirApi,
  weixinApi,
  appId,
  Roles,
} = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    if (options.select == "colony") {
      wx.cloud.callFunction({
        name: 'selectVmForClusters', //此云函数获取满足条件的虚拟机信息
        data: {
          clusterName: options.colony,
        }
      }).then(res => {
        return res.result.vmForClouster;
      }).then(vm => {
        Promise.all([this.ShutdownVm(vm)]).then(vm => {
          that.setData({
            datas1: vm[0].start,
            datas2: vm[0].down
          });
        });
      })

    } else {
      wx.cloud.callFunction({
        name: 'vmCount', //此云函数获取当前host的虚拟机数量
        data: {
          hostName: options.host
        }
      }).then(res => {
        return res.result.count
      }).then(vm => {
        that.setData({
          datas1: vm
        })
      })
    }


  },
  ShutdownVm(vms) {
    var down = [];
    var start = [];
    for (let vm of vms) {
      if (vm.status == "stopped") {
        down.push(vm);
      } else {
        start.push(vm);
      }
    }
    return {
      start,
      down
    };
  }

});