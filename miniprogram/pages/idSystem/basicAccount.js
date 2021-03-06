// pages/idSystem/basicAccount.js
import { idSystemApi } from '../../utils/utils.js';

Page({
  data: {
    inputShowed: true,
    inputVal: "",
    resultCount: 0,
    result: []
  },
  //点击搜索按钮触发的方法
  searchInput: function () {
    const that = this;
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    //模糊查询
    Promise.all([
      idSystemApi.basicAccountInfo({[that.data.param]:that.data.inputVal}).catch(() => [])
    ]).then(
      ([result]) => {
        wx.hideLoading();
        if (result.length === 0) {
          wx.showModal({
            title: '提示',
            content: '查询结果为空',
            showCancel: false
          });
        } else {
          this.setData({
            resultCount: result.length,
            result: result
          })
        }
      }).catch(err => {
        wx.hideLoading();
      });
  },
  //清除按钮触发的方法
  clearInput: function () {
    this.setData({
      inputVal: "",
      result: [],
      resultCount: 0
    });
  },
  //输入框的内容发生改变触发的方法
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      result: [],
      resultCount: 0
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      param: decodeURIComponent(options.param)
    })
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