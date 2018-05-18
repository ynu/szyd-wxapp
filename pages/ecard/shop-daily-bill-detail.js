const { ecardApi } = require('../../utils/utils.js');
const { formatMoney, formatNumber } = require('../../lib/accounting.js');

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
    this.setData(options);

    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    const { shopId, date } = options;
    Promise.all([
      // 获取商户账单
      ecardApi.dailyBill(shopId, date),

      // 获取所有子商户账单
      ecardApi.dailyBillsForSubShops(shopId, date),

      // 获取设备账单
      ecardApi.deviceBillsByShop(shopId, date),
    ]).then(([bill, subShopBills, deviceBills]) => {
      // 格式化账单数据
      bill.crAmtText = formatMoney(bill.crAmt, '￥');
      bill.drAmtText = formatMoney(bill.drAmt, '￥');
      bill.amtText = formatMoney(bill.crAmt - bill.drAmt, '￥');
      bill.transCntText = formatNumber(bill.transCnt);
      this.setData({
        bill,
        subShopBills: subShopBills.map(bill => {
          bill.transCntText = formatNumber(bill.transCnt);
          bill.amtText = formatMoney(bill.crAmt - bill.drAmt, '￥');
          return bill;
        }),
        subShopCount: subShopBills.length,
        deviceBills: deviceBills.map(bill => {
          bill.transCntText = formatNumber(bill.transCnt);
          bill.amtText = formatMoney(bill.crAmt - bill.drAmt, '￥');
          return bill;
        }),
        deviceCount: deviceBills.length,
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