const { ecardApi } = require('../../utils/utils.js');
const { formatMoney, formatNumber } = require('../../lib/accounting.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bills: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { date } = options;
    this.setData(options);
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });

    Promise.all([
      // 获取合并的账单
      ecardApi.mergedOperatorBillByDate(date),
      // 获取单个操作员账单
      ecardApi.operatorBillsByDate(date)
    ]).then(([
      bill,
      bills
    ]) => {
      wx.hideLoading();
      bill.amtText = formatMoney(bill.inAmt - bill.outAmt, '￥');
      bill.inAmtText = formatMoney(bill.inAmt, '￥');
      bill.outAmtText = formatMoney(bill.outAmt, '￥');
      bill.transCntText = formatNumber(bill.transCnt);
      this.setData({
        bill,
        bills: bills.map(bill => {
          bill.inAmtText = formatMoney(bill.inAmt, '￥');
          bill.outAmtText = formatMoney(bill.outAmt, '￥');
          return bill;
        }),
      });
    })
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