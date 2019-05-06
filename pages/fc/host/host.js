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
    var that = this;
    wx.cloud.callFunction({
      name: 'vmHost', //此云函数获取当前host类型的主机信息
      data: {
        clusterName: options.host
      }
    }).then((res) => {
      return res.result.vmHost
    }).then((hosts) => {
      for (let host of hosts) {
        host.vmcount = 0;
        wx.cloud.callFunction({
          name: 'vmCount', //此云函数获取当前host的虚拟机数量
          data: {
            hostName: host.name
          }
        }).then(res => {
          return res.result.count
        }).then(vm => {
          host.vmcount = vm.length;
          that.setData({
            datas: hosts
          })
        })
      }
    })
  },

  goToVm: function(event) {
    console.log(event);
    wx.navigateTo({
      url: `../vm/vm?host=${event.currentTarget.dataset.host}&select=host`,
    });
  },


});