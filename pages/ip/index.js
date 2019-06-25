const {
  ip
} = require('../../utils/ip.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: "",
    resultCount: 0,
    result: []
  },

  inputQuery(e) {
    this.setData({
      info: e.detail.value, // 搜索内容一旦变化，之前输入的搜索内容就失效。
      result: []
    });
  },

  ipToNumber(ip) {
    var numbers = ip.split(".");
    return parseInt(numbers[0]) * 256 * 256 * 256 +
      parseInt(numbers[1]) * 256 * 256 +
      parseInt(numbers[2]) * 256 +
      parseInt(numbers[3]);
  },

  queryInfo() {
    let result = [];
    let infoIp = this.ipToNumber(this.data.info);
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    try {
      for (let i = 0; i < ip.length; i++) {
        let startIp = this.ipToNumber(ip[i].startIp);
        let stopIp = this.ipToNumber(ip[i].stopIp);
        if (infoIp >= startIp && infoIp <= stopIp) {
          result.push({
            name: ip[i].name,
            ip: `${ip[i].startIp}-${ip[i].stopIp}`
          });
        }
      }
      this.setData({
        result: result,
      });
      if (this.data.result.length === 0) {
        wx.showModal({
          title: '提示',
          content: '查询结果为空',
          showCancel: false
        });
      }
      wx.hideLoading();
    } catch (err) {
      wx.hideLoading();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

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