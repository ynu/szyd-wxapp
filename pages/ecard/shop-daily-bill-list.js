const { ecardApi } = require('../../utils/utils.js');
const { formatMoney } = require('../../lib/accounting.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    billsCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);

    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    ecardApi.dailyBills(options.shopId).then(bills => {
      this.setData({
        bills: bills.map(bill => {
          bill.crAmtText = formatMoney(bill.crAmt, '￥');
          return bill;
        }),
        billsCount: bills.length,
      });
      wx.hideLoading();
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