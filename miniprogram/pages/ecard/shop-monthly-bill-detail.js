import * as echarts from "../../lib/ec-canvas/echarts.js";
import { ecardApi } from "../../utils/utils.js";
import { formatMoney, formatNumber } from "../../lib/accounting.js";
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData(options);
    app.wxp.showLoading({
      title: "正在加载",
      mask: true
    });
    const { shopid, date } = options;
    Promise.all([
      // 获取商户账单
      ecardApi.monthlyBill({
        shopid: shopid,
        accdate: date
      }),

      // 获取所有子商户账单
      ecardApi.monthlyBillsForSubShops(shopid, date),

      // 获取设备账单
      ecardApi.deviceBillsByShop(shopid, date)
    ]).then(([bill, subShopBills, deviceBills]) => {
      // 格式化账单数据
      bill[0].cramtText = formatMoney(bill[0].cramt, "￥");
      bill[0].dramtText = formatMoney(bill[0].drmant, "￥");
      bill[0].amtText = formatMoney(bill[0].cramt - bill[0].drmant, "￥");
      bill[0].transcntText = formatNumber(bill[0].transcnt);
      this.setData({
        bill: bill[0],
        subShopBills: subShopBills.map(bill => {
          bill.transcntText = formatNumber(bill.transcnt);
          bill.amtText = formatMoney(bill.cramt - bill.drmant, "￥");
          return bill;
        }),
        subShopCount: subShopBills.length,
        deviceBills: deviceBills.map(bill => {
          bill.transcntText = formatNumber(bill.transcnt);
          bill.amtText = formatMoney(bill.cramt - bill.drmant, "￥");
          return bill;
        }),
        deviceCount: deviceBills.length
      });
      this.initChart();
      app.wxp.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.ecComponent = this.selectComponent("#mychart-dom-bar");
  },

  initChart() {
    const { subShopBills, deviceBills, name } = this.data;
    const option = {
      title: {
        text: `${name}日消费`
      },
      series: [
        {
          label: {
            normal: {
              fontSize: 10
            }
          },
          type: "pie",
          radius: [0, "50%"],
          data: subShopBills
            .filter(bill => bill.cramt > 0)
            .map(bill => ({
              value: bill.cramt,
              name: bill.shopname
            }))
        }
      ]
    };
    this.ecComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width,
        height
      });
      canvas.setChart(chart);
      chart.setOption(option);
      this.setData({
        isLoaded: true
      });
      return chart;
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
