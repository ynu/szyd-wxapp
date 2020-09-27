// miniprogram/pages/yjs/info/infoDetail.js
import { yjsApi } from '../../../utils/utils.js';

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
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    Promise.all([
      //通过infoQuery函数查询对应职工号的全部信息
      yjsApi.yjsInfo({"xh":options.XH}).catch(() => [])
    ]).then(
      ([result]) => {
        this.setData({
          result: result[0]
        })
        wx.hideLoading();
      }).catch(err => {
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