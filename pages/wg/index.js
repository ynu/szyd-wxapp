// pages/wg/index.js
const {
  ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles,
} = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [],
  },

  goToWebFirm: function (event) {

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
    //this.setData({ datas: zqApi.data});
    var that = this;
    zqApi.webFirm().then(function (data) {

      for (var i = 0; i < data.length; i++) {
        if (data[i].wbstate == 0) { data[i].wbstate = "正在使用" }
        else { data[i].wbstate = "已停用" }
      }
      zqApi.webnewsCount().then(function (dataa) {
        for (var j = 0; j < data.length; j++) {
          data[j].count = 0
          for (var a = 0; a < dataa.length; a++) {
            if (data[j].wbfirmid === dataa[a].owner) {
              data[j].count = dataa[a].count;
            }
          }
        }
        that.setData({ datas: data });
      });

    });


  },
});