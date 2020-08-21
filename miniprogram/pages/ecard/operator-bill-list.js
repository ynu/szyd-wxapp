import * as echarts from '../../lib/ec-canvas/echarts.js';
const { ecardApi } = require('../../utils/utils.js');
const moment = require('../../lib/moment.js');
const { formatMoney, formatNumber } = require('../../lib/accounting.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    bills: [],
    billsCount: 0,
    loading: true,
    ec: {
      lazyLoad: true,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    const setData = (date, bills) => {
      const bill = {
        date,
        inamt: 0,
        outamt: 0,
        transcnt: 0,
      };
      bills.reduce((acc, cur) => {
        bill.inamt += parseFloat((cur.inamt || 0));
        bill.outamt += parseFloat((cur.outamt || 0));
        bill.transcnt += parseInt((cur.transcnt || 0));
        return bill;
      }, bill);
      bill.amtText = formatMoney(bill.inamt - bill.outamt, '￥');
      bill.transcntText = formatNumber(bill.transcnt);
      this.setData({
        bills: [
          ...this.data.bills,
          bill,
        ],
        billsCount: this.data.billsCount + 1,
      });
    };

    const getPrevBill = (date) => {
      if (count--) {

        // 这里不支持finally
        ecardApi.operatorBillsByDate(date).then(bills => {
          if (bills.length) setData(date, bills);
          const prevDay = moment(date).subtract(1, 'days').format('YYYYMMDD');
          getPrevBill(prevDay);
        }).catch(err => {
          const prevDay = moment(date).subtract(1, 'days').format('YYYYMMDD');
          getPrevBill(prevDay);
        });
      } else {
        this.setData({
          loading: false,
        });
        this.initChart();
      }
    };

    let count = 100;
    const yeatoday = moment().subtract(1, 'days').format('YYYYMMDD');
    getPrevBill(yeatoday);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  initChart() {
    const bills = this.data.bills;
    const option = {
      title: {
        text: '一卡通操作员最近15天日收入'
      },
      legend: {
        data: ['操作员收入']
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
          data: bills.map(bill => bill.date).slice(0, 15).reverse(),
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '操作员收入',
          type: 'line',
          stack: '总量',
          areaStyle: { normal: {} },
          data: bills.map(bill => bill.inamt).slice(0, 15).reverse(),
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