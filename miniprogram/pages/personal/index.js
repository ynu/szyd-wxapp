// pages/personal/index.js
import { Roles, meansApi, shopManagerRolePrefix, doorManagerRolePrefix } from '../../utils/utils.js';
const app = getApp();
import { icon20 } from "../../images/base64";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    modules: [],
    IsApply: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      icon: icon20
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
      wx.getUserInfo({}).then(res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      })
    }
  },
  //获取用户信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //点击模块跳转
  mySelect(e) {
    const name = e.currentTarget.dataset.name;
    let module;
    switch (name) {
      case "人事":
        module = "rs/index";
        break;
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
      case "IP地址段查询":
        module = "ip/index";
        break;
      case "数据中心门禁":
        module = "door/supervisor-index";
        break;
      case "研究生信息查询":
        module = "yjs/index";
        break;
      case "本科生信息查询":
        module = "bks/index";
        break;
      case "统一身份认证系统":
        module = "idSystem/index";
        break;
      case "权限管理":
        module = "authority/index";
        break;
    }
    wx.navigateTo({
      url: `/pages/${module}`,
    })
  },
  //获取当前用户的权限
  getPermission() {
    let obj = {};
    const db = wx.cloud.database();
    const that = this;
    this.setData({
      IsApply: false
    });
    //获取云端数据库判断当前用户拥有哪些模块的权限
    meansApi.getRoles().then(res => {
      let modules = [];
      if (res.data.length != 0) {
        if (res.data[0].roles.length != 0) {
          that.setData({
            IsApply: true
          });
        }
        res.data[0].roles.forEach(role => {
          switch (role) {
            case Roles.RsSupervisor:
              modules.push({
                name: "人事"
              });
              break;
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
            case Roles.IpSupervisor:
              modules.push({
                name: "IP地址段查询"
              });
              break;
            case Roles.DoorManager:
              modules.push({
                name: "数据中心门禁"
              });
              break;
            case Roles.YjsSupervisor:
              modules.push({
                name: "研究生信息查询"
              });
              break;
            case Roles.BksSupervisor:
              modules.push({
                name: "本科生信息查询"
              });
              break;
            case Roles.IdSystemSupervisor:
              modules.push({
                name: "统一身份认证系统"
              });
              break;
            case Roles.AuthorityManager:
              modules.push({
                name: "权限管理"
              });
              break;
            default:
              if (role.indexOf(shopManagerRolePrefix) != -1) {
                modules.push({
                  name: "一卡通"
                });
              } else if (role.indexOf(doorManagerRolePrefix) != -1) {
                modules.push({
                  name: "数据中心门禁"
                });
              }
          }
        })

        modules = modules.reduce((item, next) => {
          obj[next.name] ? '' : obj[next.name] = true && item.push(next);
          return item;
        }, []);
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    this.getPermission();

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
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    this.getPermission();
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