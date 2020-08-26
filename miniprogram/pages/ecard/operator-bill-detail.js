import { ecardApi } from '../../utils/utils.js';
import { formatMoney, formatNumber } from '../../lib/accounting.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bills: [],
    billAll:{}
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
      billAll,
      bills
    ]) => {
      wx.hideLoading();      
      billAll.amtText = formatMoney(billAll.inAmt - billAll.outAmt, '￥');
      billAll.inamtText = formatMoney(billAll.inAmt, '￥');
      billAll.outamtText = formatMoney(billAll.outAmt, '￥');
      billAll.transcntText = formatNumber(billAll.transCnt);
      this.setData({
        billAll,
        bills: bills.map(bill => {
          bill.inamtText = formatMoney(bill.inamt, '￥');
          bill.outamtText = formatMoney(bill.outamt, '￥');
          bill.transcntText = formatNumber(bill.transcnt);
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