const fcApi = require('../../../utils/utils.js');
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
    console.log(options.colony);
    console.log(fcApi.SelectVmForClusters(options.colony))
    // this.setData({ 
    //   datas1: colony[0],
    //   datas2: colony[1],
      
    //   });
  },
  
  // goToVmOne: function (event) {
  //   console.log(event);
  //   wx.navigateTo({
  //     url: `./vmone?vmone=${event.currentTarget.dataset.vmone}`,
  //   });
  // },
});