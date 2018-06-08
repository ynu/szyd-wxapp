const config = require('../../../config');
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
    let vmId = options.vmone.split(":")[4];
    wx.request({
      url: `${config.service.host}/site/3F7B07E2/vmResource/${vmId}?token=${config.token}`,
      success: function (res) {
        console.log(res.data.result);
        that.setData({
          datas: res.data.result
        });
      }
    });
  },
});