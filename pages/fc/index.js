const {
  ecardApi,
  zqApi,
  fcApi,
  uirApi,
  weixinApi,
  appId,
  Roles,
} = require('../../utils/utils.js');
let datas;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas,
  },

  goToHost: function(event) {
    wx.navigateTo({
      url: `./host/host?host=${event.currentTarget.dataset.host}`,
    });
  },

  goToVm: function(event) {
    wx.navigateTo({
      url: `./vm/vm?colony=${event.currentTarget.dataset.vm.name}&select=colony`,
    });
  },

  onLoad: function() {
    var vm = [];
    var that = this;
    var host = [];
    wx.cloud.callFunction({
      name: 'fcApiSetList',
    }).then((res) => {
      return res.result.setList
    }).then((res) => {
      that.setData({
        datas: res
      });
    })
  },
});