// pages/ecard/query/index.js
const {
  ecardApi
} = require('../../../utils/utils.js');

Page({
  data: {
    inputShowed: true,
    inputVal: "",
    resultCount: 0,
    result: []
  },
  searchInput: function() {
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    const db = wx.cloud.database(); //初始化数据库
    //模糊查询，从对象的name模糊查询得出结果
    Promise.all([
      ecardApi.cardInfoQuery(this.data.inputVal).catch(() => [])
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
      }).catch(error => {
      wx.hideLoading();
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: "",
      result: []
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value,
      result: [],
      resultCount: 0
    });
  }
});