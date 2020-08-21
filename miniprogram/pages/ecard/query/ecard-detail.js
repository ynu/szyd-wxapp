// pages/ecard/query/ecard-detail.js
import { ecardApi } from '../../../utils/utils.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    Promise.all([
      ecardApi.cardInfo(options.stuempno).catch(() => [])
    ]).then(
      (result) => {
        wx.hideLoading();
        switch (result[0][0].cardstatus) {
          case 1:
            result[0][0].cardstatus = "正常";
            break;
          case 2:
            result[0][0].cardstatus = "注销";
            break;
          case 3:
            result[0][0].cardstatus = "挂失";
            break;
          case 4:
            result[0][0].cardstatus = "冻结";
            break;
        };
        this.setData({
          cardInfo: result[0][0]
        })
      }).catch(error => {
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})