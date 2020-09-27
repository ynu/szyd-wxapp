// miniprogram/pages/bks/info/query.js
import { bksApi } from '../../../utils/utils.js';
Page({
  data: {
    inputShowed: true,
    inputVal: "",
    resultCount: 0,
    result: [],
    placeholder: ""
  },
  //点击搜索按钮触发的方法
  searchInput: function () {
    const that = this;
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    //模糊查询
    //通过infoQuery函数查询对应职工号的全部信息
    bksApi.bksInfo({
      [that.data.param]: that.data.inputVal
    }).then(
      (result) => {
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
        wx.hideLoading();
      }).catch(err => {
      wx.showModal({
        title: '提示',
        content: '系统异常，请联系管理员',
        showCancel: false
      });
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
    let placeholder;
    if(options.param == "xm"){
      placeholder = "姓名";
    }else{
      placeholder = "学号"
    }
    this.setData({
      param: decodeURIComponent(options.param),
      placeholder,
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