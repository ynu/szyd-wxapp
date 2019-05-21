const {
  ecardApi,
  zqApi,
  fcApi,
  weixinApi,
  appId,
  Roles,
} = require("../../utils/utils.js");
let resData;
let openIdNew;
Page({
  data: {
    resData,
    isUirManager: false,
    loadingOpenId: true,
    openIdNew,
    bills: [],
    zq: {
      firmCount: 0,
      runningFirmCount: 0, //正在使用的站点数量
      newsCount: 0, //站群的文章总数量
    },
    fc: {
      vmCount: 0, //虚拟机的总数量
      clusterCount: 0,
      hostCount: 0,
      runningFirmCount: 0, //正在运行着的虚拟机数量
    },
    ecard: {
      shops: [],
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
      title: "正在加载",
      mask: true
    });

    // 为确保所有promise都能resolve，必须添加catch
    Promise.all([
        ecardApi.dailyBills(1).catch(() => []),
        ecardApi.shops().catch(() => []),
        ecardApi.cardCount().catch(() => 0),
        ecardApi.deviceCount().catch(() => 0),
        zqApi.firmCount().catch(() => 0),
        zqApi.runningCount().catch(() => 0),
        zqApi.newsCount().catch(() => 0),
        fcApi.vmCount().catch(() => 0),
        fcApi.clusters().catch(() => 0),
        fcApi.hostCount().catch(() => 0),
        fcApi.runningVmCount().catch(() => 0),
      ])
      .then(
        ([
          bills,
          shops,
          card_count,
          devices_count,
          firmCount,
          runningFirmCount,
          newsCount,
          vmCount,
          clusters,
          hostCount,
          runningVmCount,
        ]) => {
          wx.hideLoading();

          // 按日期降序排列
          bills.sort((a, b) => {
            if (a.accDate > b.accDate) return -1;
            else if (a.accDate < b.accDate) return 1;
            return 0;
          });

          this.setData({
            bills,
            zq: {
              firmCount,
              runningFirmCount,
              newsCount
            },
            fc: {
              vmCount,
              clusterCount: clusters.length,
              hostCount,
              runningVmCount,
            },
            ecard: {
              shops,
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

  onLoad() {},
  onShow() {
    this.initPage();
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
      url: "/pages/application/index"
    });
  },

  getPermission() {
    const db = wx.cloud.database();
    const that = this;
    //通过云函数获取当前用户的OPENID
    wx.cloud.callFunction({
      name: "getOpenId",
      complete: res => {
        this.setData({
          openIdNew: res.result.OPENID
        });
        //获取云端数据库判断当前用户拥有哪些模块的权限
        db.collection("user-permissions")
          .where({
            _openid: this.data.openIdNew
          })
          .get()
          .then(res => {
            if (res.data.length != 0) {
              db.collection("user-permissions")
                .where({
                  _openid: this.data.openIdNew
                })
                .get()
                .then(res => {
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
                    }
                  })
                  that.setData(roles);
                });
            }
          });
      }
    });

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
});