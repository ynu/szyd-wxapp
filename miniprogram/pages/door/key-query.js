// pages/door/key-query.js
import { ecardApi } from '../../utils/utils.js';
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
    });
  },

  queryInfo() {
    let obj = {};
    let result = [];
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    const db = wx.cloud.database(); //初始化数据库
    //模糊查询，从对象的name,personName,time模糊查询得出结果
    db.collection("open-door-logs").orderBy('time', 'desc').where({
      name: db.RegExp({
        regexp: this.data.info,
        options: 'i' //大小写不区分
      })
    }).get().then((res) => {
      result = result.concat(res.data)
      db.collection("open-door-logs").orderBy('time', 'desc').where({
        personName: db.RegExp({
          regexp: this.data.info,
          options: 'i' //大小写不区分
        })
      }).get().then((res) => {
        result = result.concat(res.data)
        db.collection("open-door-logs").orderBy('time', 'desc').where({
          time: db.RegExp({
            regexp: this.data.info,
            options: 'i' //大小写不区分
          })
        }).get().then((res) => {
          result = result.concat(res.data)
          result = result.reduce((item, next) => {
            obj[next._id] ? '' : obj[next._id] = true && item.push(next);
            return item;
          }, []);
          this.setData({
            result: result
          })
          if (this.data.result.length === 0) {
            wx.showModal({
              title: '提示',
              content: '查询结果为空',
              showCancel: false
            });
          }
          wx.hideLoading();
        });
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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