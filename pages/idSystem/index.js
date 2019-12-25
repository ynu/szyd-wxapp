// pages/idSystem/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //群组信息
  toGroup() {
    wx.navigateTo({
      url: '/pages/idSystem/group',
    })
  },
  //应用账户信息
  toAppAccount() {
    wx.navigateTo({
      url: '/pages/idSystem/appAccount',
    })
  },
  //认证应用信息
  toAppCertification() {
    wx.navigateTo({
      url: '/pages/idSystem/appCertification',
    })
  },
  //查询用户群组影射信息
  toGroupInnuendo() {
    wx.navigateTo({
      url: '/pages/idSystem/groupInnuendo',
    })
  },
  //查询账号基本信息
  toBasicAccount() {
    wx.navigateTo({
      url: '/pages/idSystem/basicAccount',
    })
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