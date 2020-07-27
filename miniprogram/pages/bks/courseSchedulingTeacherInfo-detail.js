// pages/bks/courseSchedulingTeacherInfo-detail.js
import { bksApi } from '../../utils/utils.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.wxp.showLoading({
      title: "正在加载",
      mask: true
    });
    Promise.all([
      bksApi.courseSchedulingTeacherInfoQuery({"kch":options.KCH}).catch(() => [])
    ]).then(
      ([result]) => {
        this.setData({
          result: result[0]
        })
        app.wxp.hideLoading();
      }).catch(err => {
        app.wxp.hideLoading();
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