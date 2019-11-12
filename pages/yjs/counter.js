// pages/yjs/counter.js
const {
  yjsCounter,
  yjsApi
} = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    wx.showLoading({
      title: '正在加载',
    })
    this.getYjsCounter();
    setTimeout(function() {
      that.setData({
        result: yjsCounter
      });
      wx.hideLoading();
    }, 2000); //设置setTimeout，异步执行
  },

  /**
   * 获取研究生数量
  */
  getYjsCounter() {
    //第一次循环，总的类别
    for (let i = 0; i < yjsCounter.length; i++) {
      //第二次循环，类别下一层分类
      for (let j = 0; j < yjsCounter[i].list.length; j++) {
        Promise.all([yjsApi.counter(yjsCounter[i].list[j].conditions)]).then(result => {
          //插入counter到数组yjsCounter成为新的属性
          yjsCounter[i].list[j].counter = result[0];
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})