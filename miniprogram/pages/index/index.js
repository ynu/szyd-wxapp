import { ecardApi, zqApi, fcApi, weixinApi, appId, Roles, shopManagerRolePrefix, meansApi } from '../../utils/utils.js';
let resData;
const app = getApp();
Page({
  data: {
    resData,
    isUirManager: false,
    loadingOpenId: true,
    zq: {
      firmCount: 0,
      runningFirmCount: 0, //正在使用的站点数量
      newsCount: 0, //站群的文章总数量
    },
    fc: {
      vmCount: 0, //虚拟机的总数量
      clustersCount: 0,
      hostCount: 0,
      runningVmCount: 0, //正在运行着的虚拟机数量
    },
    ecard: {
      shopsCount: 0,
      devices_count: 0,
      card_count: 0,
    },
    // 风控系统
    ris: {
      userCount: 0, // 用户数
      devCount: 0, // 资产数
    },
    isFcSupervisor: false,
    isZqSupervisor: false,
    isEcardSupervisor: false,
    isRisSupervisor: false,
  },
  initPage() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });

    // 为确保所有promise都能resolve，必须添加catch
    Promise.all([
        ecardApi.shopsCount().catch(() => []),
        ecardApi.cardCount().catch(() => 0),
        ecardApi.deviceCount().catch(() => 0),
        zqApi.firmCount().catch(() => 0),
        zqApi.runningCount().catch(() => 0),
        zqApi.newsCount().catch(() => 0),
        fcApi.vmCount().catch(() => 0),
        fcApi.clustersCount().catch(() => []),
        fcApi.hostCount().catch(() => 0),
        fcApi.runningVmCount().catch(() => 0),
      ])
      .then(
        ([
          shopsCount,
          card_count,
          devices_count,
          firmCount,
          runningFirmCount,
          newsCount,
          vmCount,
          clustersCount,
          hostCount,
          runningVmCount,
        ]) => {
          wx.hideLoading();
          this.setData({
            zq: {
              firmCount,
              runningFirmCount,
              newsCount
            },
            fc: {
              vmCount,
              clustersCount,
              hostCount,
              runningVmCount,
            },
            ecard: {
              shopsCount,
              card_count,
              devices_count,
            }
          });
        }
      )
      .catch(error => {
        wx.hideLoading();
      });
  },

  onLoad() {
    this.initPage();
  },
  onShow() {
    this.getPermission();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  onPullDownRefresh() {
    this.initPage();
    this.getPermission();
    wx.stopPullDownRefresh();
  },

  toApply() {
    wx.navigateTo({
      url: '/pages/application/index'
    });
  },

  getPermission() {
    const db = wx.cloud.database();
    const that = this;
    //获取云端数据库判断当前用户拥有哪些模块的权限
    meansApi.getRoles().then(res => {
      if (res.data.length != 0) {
        const roles = {};
        res.data[0].roles.forEach(role => {
          switch (role) {
            case Roles.FcSupervisor:
              roles.isFcSupervisor = true;
              break;
            case Roles.ZqSupervisor:
              roles.isZqSupervisor = true;
              break;
            case Roles.EcardSupervisor:
              roles.isEcardSupervisor = true;
              break;
            case Roles.RisSupervisor:
              roles.isRisSupervisor = true;
              break;
            default:
              if (role.indexOf(shopManagerRolePrefix) != -1) {
                roles.isEcardSupervisor = true;
              }
          }
        })
        that.setData(roles);
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
});