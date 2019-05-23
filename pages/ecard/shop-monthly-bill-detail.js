import * as echarts from '../../lib/ec-canvas/echarts.js';
const {
  ecardApi,
} = require('../../utils/utils.js');
const {
  formatMoney, formatNumber,
} = require('../../lib/accounting.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true,
    },
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
    const { shopId, date } = options;;
    Promise.all([
      // 获取商户账单
      ecardApi.monthlyBill(shopId, date),

      // 获取所有子商户账单
      ecardApi.monthlyBillsForSubShops(shopId, date),

      // 获取设备账单
      ecardApi.deviceMonthlyBillsByShop(shopId, date),
    ]).then(([bill, subShopBills, deviceBills]) => {
      // 格式化账单数据
      bill[0].crAmtText = formatMoney(bill[0].crAmt, '￥');
      bill[0].drAmtText = formatMoney(bill[0].drAmt, '￥');
      bill[0].amtText = formatMoney(bill[0].crAmt - bill[0].drAmt, '￥');
      bill[0].transCntText = formatNumber(bill[0].transCnt);
      this.setData({
        bill:bill[0],
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
      this.initChart();
      wx.hideLoading();
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
  },

  initChart() {
    const { subShopBills, deviceBills, name } = this.data;
    const option = {
      title: {
        text: `${name}月消费`,
      },
      series: [{
        label: {
          normal: {
            fontSize: 10,
          },
        },
        type: 'pie',
        radius: [0, '50%'],
        data: subShopBills.filter(bill => bill.crAmt > 0).map(bill => ({
          value: bill.crAmt,
          name: bill.shopName,
        })),
      }],
    };
    this.ecComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width,
        height,
      });
      canvas.setChart(chart);
      chart.setOption(option);
      this.setData({
        isLoaded: true,
      });
      return chart;
    });
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