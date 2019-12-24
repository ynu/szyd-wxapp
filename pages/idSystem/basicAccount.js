// pages/idSystem/basicAccount.js
const {
  idSystemApi
} = require('../../utils/utils.js')
Page({
  data: {
    inputShowed: true,
    inputVal: "",
    resultCount: 0,
    result: []
  },
  searchInput: function() {
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    //模糊查询，从对象的name模糊查询得出结果
    Promise.all([
      idSystemApi.basicAccountInfo(this.data.inputVal).catch(() => [])
    ]).then(
      ([result]) => {
        wx.hideLoading();
        if (result.length === 0) {
          wx.showModal({
            title: '提示',
            content: '查询结果为空',
            showCancel: false
          });
        } else {
          this.setData({
            resultCount: result.length,
            result: result
          })
        }
      }).catch(error => {
      wx.hideLoading();
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: "",
      result: []
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value,
      result: [],
      resultCount: 0
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})