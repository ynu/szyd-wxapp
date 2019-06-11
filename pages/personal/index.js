// pages/personal/index.js
const {
  Roles,
  meansApi,
  shopManagerRolePrefix
} = require('../../utils/utils.js');
const app = getApp();
const base64 = require("../../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    select: false,
    tihuoWay: "模块权限",
    modules: [],
    IsApply: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    this.setData({
      icon: base64.icon20
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //点击下拉
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },
  //点击模块跳转
  mySelect(e) {
    const name = e.currentTarget.dataset.name;
    let module;
    switch (name) {
      case "虚拟化平台":
        module = "fc/index";
        break;
      case "站群系统":
        module = "zq/index";
        break;
      case "一卡通":
        module = "ecard/supervisor-index";
        break;
      case "风控系统":
        module = "fc/index";
        break;
    }
    wx.navigateTo({
      url: `/pages/${module}`,
    })
  },
  //获取当前用户的权限
  getPermission() {
    this.setData({
      IsApply: false
    });
    const db = wx.cloud.database();
    const that = this;
    //获取云端数据库判断当前用户拥有哪些模块的权限
    meansApi.getRoles().then(res => {
      if (res.data.length != 0) {
        if (res.data[0].roles.length != 0) {
          that.setData({
            IsApply: true
          });
        }
        let modules = [];
        res.data[0].roles.forEach(role => {
          switch (role) {
            case Roles.FcSupervisor:
              modules.push({
                name: "虚拟化平台"
              });
              break;
            case Roles.ZqSupervisor:
              modules.push({
                name: "站群系统"
              });
              break;
            case Roles.EcardSupervisor:
              modules.push({
                name: "一卡通"
              });
              break;
            case Roles.RisSupervisor:
              modules.push({
                name: "风控系统"
              });
              break;
            default:
              if (role.indexOf(shopManagerRolePrefix) != -1 && !Roles.EcardSupervisor) {
                modules.push({
                  name: "一卡通"
                });
              }
          }
        })
        that.setData({
          modules: modules
        });
      }
      wx.hideLoading();
    })
  },
  //申请功能跳转
  toApply() {
    wx.navigateTo({
      url: '/pages/application/index'
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
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    this.getPermission();

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
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    this.getPermission();
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