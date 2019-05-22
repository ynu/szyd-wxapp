import * as echarts from '../../lib/ec-canvas/echarts.js';
const { ecardApi } = require('../../utils/utils.js');
const { formatMoney, formatNumber } = require('../../lib/accounting.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    billsCount: 0,
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
    ecardApi.monthlyBills(options.shopId).then(bills => {
      // 按日期降序排列
      bills.sort((a, b) => {
        if (a.accDate > b.accDate) return -1;
        else if (a.accDate < b.accDate) return 1;
        else return 0;
      });
      this.setData({
        bills: bills.map(bill => {
          bill.crAmtText = formatMoney(bill.crAmt, '￥');
          bill.transCntText = formatNumber(bill.transCnt);
          return bill;
        }),
        billsCount: bills.length,
      });
      this.initChart();
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
  },

  initChart() {
    const { bills, name } = this.data;
    const option = {
      title: {
        text: `${name}最近15个月消费趋势`
      },
      legend: {
        data: ['金额', '刷卡数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: bills.map(bill => bill.accDate).slice(0, 15).reverse(),
        }
      ],
      yAxis: [
        {
          type: 'value'
        },
      ],
      series: [
        {
          name: '金额',
          type: 'line',
          areaStyle: { normal: {} },
          data: bills.map(bill => bill.crAmt).slice(0, 15).reverse(),
        },
        {
          name: '次数',
          type: 'line',
          areaStyle: { normal: {} },
          data: bills.map(bill => bill.transCnt).slice(0, 15).reverse(),
        },
      ]
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