const {
  ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles,
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
  onLoad: function (options) {
    var that = this;
    console.log(options.host);
    Promise.all([ fcApi.SelectHostForClusters(options.host)]).then(hosts=>{
      that.setData({
        datas: hosts[0]
      });

    });

  },
  goToVm: function (event) {
    wx.navigateTo({
      url: `../vm/vm?colony=${JSON.stringify(setvm(event.currentTarget.dataset.vm))}`,
    });
  },


});