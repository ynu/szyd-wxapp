// pages/door/supervisor-index.js
import { Roles, shopManagerRolePrefix, meansApi } from "../../utils/utils.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDoorManager: false
  },
  //去开门进入index
  toOpenDoor() {
    wx.navigateTo({
      url: '/pages/door/index',
    })
  },
  //去查看日志进入log
  toDoorLogs() {
    wx.navigateTo({
      url: '/pages/door/query-log',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    //获取当前用户的数据库权限
    meansApi.getRoles().then(res => {
      res.data[0].roles.forEach(role => {
        switch (role) {
          case Roles.DoorManager:
            that.setData({
              isDoorManager: true
            });
            break;
        }
      });
      wx.hideLoading();
    });

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