// pages/ecard/query/index.js
const {
  ecardApi
} = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    resultCount: 0,
    result: []
  },

  inputQuery(e) {
    this.setData({
      info: e.detail.value, // 搜索内容一旦变化，之前输入的搜索内容就失效。
    });
  },

  queryInfo() {
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    Promise.all([
      ecardApi.cardInfoQuery(this.data.info).catch(() => [])
    ]).then(
      ([result]) => {
        wx.hideLoading();
        this.setData({
          resultCount: result.length,
          result: result
        })
      }).catch(error => {
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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