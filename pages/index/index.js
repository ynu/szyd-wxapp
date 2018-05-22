import * as echarts from '../../lib/ec-canvas/echarts.js';

const { ecardApi } = require('../../utils/utils.js');

Page({
  data: {
    isUirManager: false,
    loadingOpenId: true,
    ec: {
      lazyLoad: true,
    },
  },

  onLoad() {
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    ecardApi.dailyBills(1).then((bills) => {
      // 按日期降序排列
      bills.sort((a, b) => {
        if (a.accDate > b.accDate) return -1;
        else if (a.accDate < b.accDate) return 1;
        return 0;
      });
      this.setData({
        bills,
      });
      this.initChart();
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
  },

  initChart() {
    const { bills, name } = this.data;
    const option = {
      title: {
        text: '一卡通日消费趋势',
      },
      legend: {
        data: ['金额', '刷卡数'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: bills.map(bill => bill.accDate).reverse(),
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '金额',
          type: 'line',
          areaStyle: { normal: {} },
          data: bills.map(bill => bill.crAmt).reverse(),
        },
        {
          name: '次数',
          type: 'line',
          areaStyle: { normal: {} },
          data: bills.map(bill => bill.transCnt).reverse(),
        },
      ],
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

  navigateToFc: () => {
    wx.navigateTo({
      url: '/pages/fc/index',
    });
  },
});
