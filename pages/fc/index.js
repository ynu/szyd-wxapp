<<<<<<< HEAD
const {
  ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles,
} = require('../../utils/utils.js');
=======
const config = require('../../config');

// 创建虚拟机数组分为启动的和没有启动的
function setvm(colony) {
  var vm = []
  var vmstart = []
  var host = colony.host
  for (let h of host) {

    var vmstart = vmstart.concat(h.vm)
  }
  vm.push(vmstart)
  vm.push(colony.vmstop)
  return vm
}

// pages/fc/index.js

//获取虚拟机总数
function getAllMachineSum() {
  var offset = 0
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.service.getxj + offset,
      success: function (res) {
        let total = res.data.result.total
        resolve(total)
      }
    })
  })
}
//获取虚拟机列表
function getAllMachineList(offset) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.service.getxj + offset,
      success: function (res) {
        resolve(res)

      }
    })
  })
}

//按规则合并所以列表
const setdata = (colony, host, vm) => {
  for (var c in colony) {
    colony[c].host = []
    colony[c].vmstop = []
    colony[c].vmtotal = 0
    colony[c].hoststatic = 0
    colony[c].vmstatic = 0
    for (var v in vm) {
      if (colony[c].name == vm[v].clusterName) {
        colony[c].vmtotal += 1
        if (vm[v].status == "running") {
          colony[c].vmstatic += 1
        }
        if (vm[v].status == "stopped") {
          colony[c].vmstop.push(vm[v])
        }
      }

    }
    for (var h in host) {
      host[h].vm = []
      if (colony[c].name == host[h].clusterName) {
        colony[c].host.push(host[h])
        if (host[h].status == "running") {
          colony[c].hoststatic += 1
        }
      }
      for (var v in vm) {
        if (vm[v].hostName == host[h].hostRealName) {
          host[h].vm.push(vm[v])
        }
      }
    }
  }

  return colony

}
>>>>>>> af44e7c5e86396cdfa09cd51fb8262586bb9d5e3
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  goToHost: function (event) {

    wx.navigateTo({
      url: `./host/host?host=${event.currentTarget.dataset.host}`,
    });
  },

  goToVm: function (event) {
    wx.navigateTo({
      url: `./vm/vm?colony=${JSON.stringify(setvm(event.currentTarget.dataset.vm))}`,
    });
  },

  onLoad: function () {
    var vm = [];
    var that = this;
    var host = [];
    Promise.all([fcApi.setlist()]).then(vm=>{
      console.log(vm[0]);
      that.setData({
        datas:vm[0]
      })
    });
  },
});