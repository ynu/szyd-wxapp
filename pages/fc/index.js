const {
  ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles,
} = require('../../utils/utils.js');
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
      url: `./vm/vm?colony=${event.currentTarget.dataset.vm.name}&select=colony`,
    });
  },

  onLoad: function () {
    let vm = [];
    let that = this;
    let host = [];
    wx.showLoading({
      title: '正在加载',
    });
    Promise.all([fcApi.setlist()]).then(vm=>{
      that.setData({
        datas:vm[0]
      });
      wx.hideLoading();
    });
  },
});