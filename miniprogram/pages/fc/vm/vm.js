import { fcApi } from '../../../utils/utils.js';
const app = getApp();
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
    const that = this;
    app.wxp.showLoading({
      title: '正在加载',
    });
    if (options.select == "colony") {
      Promise.all([fcApi.SelectVmForClusters(options.colony)]).then(vm => {
        Promise.all([fcApi.ShutdownVm(vm[0])]).then(vm => {
          that.setData({
            datas1: vm[0].start,
            datas2: vm[0].down
          });
          app.wxp.hideLoading();
        });
      });
    } else {
      Promise.all([fcApi.SelectVmForHost(options.host)]).then(vm => {
        that.setData({
          datas1: vm[0]
        });
        app.wxp.hideLoading();
      });
    }


  },

});