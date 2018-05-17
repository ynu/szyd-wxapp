const { appId, weixinApi } = require('../../utils/utils.js');

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
  
  },

  toDailyBill() {
    wx.redirectTo({
      url: '/pages/ecard/daily-bill-list',
    })
  },
  toApply() {
    wx.showLoading({
      title: '正在加载',
      mask: true,
    })
    weixinApi.getOpenId().then(openid => {
      console.log(openid);
      wx.hideLoading();
      wx.navigateToMiniProgram({
        appId: 'wx63b32180ec6de471',
        path: `pages/index/apply?appName=数字云大&appId=${appId}&userId=${openid}&remark=申请一卡通权限`,
        extraData: {},
      });
    });
    
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