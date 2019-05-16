const {
  ecardApi,
  zqApi,
  fcApi,
  weixinApi,
  appId,
  Roles
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
      newsCount: 0
    },
    fc: {
      vmCount: 0,
      clusterCount: 0,
      hostCount: 0
    },
    ecard: {
      shops: [],
      devices: []
    },
    // 风控系统
    ris: {
      userCount: 0, // 用户数
      devCount: 0, // 资产数
    },
    isFcSupervisor: false,
    isFaSupervisor: false,
    isEcardSupervisor: false
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
        zqApi.firmCount().catch(() => 0),
        zqApi.newsCount().catch(() => 0),
        fcApi.vmCount().catch(() => 0),
        fcApi.clusters().catch(() => 0),
        fcApi.hostCount().catch(() => 0),
      ])
      .then(
        ([
          bills,
          shops,
          firmCount,
          newsCount,
          vmCount,
          clusters,
          hostCount
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
              newsCount
            },
            fc: {
              vmCount,
              clusterCount: clusters.length,
              hostCount
            },
            ecard: {
              shops
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
    this.getPermission();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  onPullDownRefresh() {
    this.initPage();
    wx.stopPullDownRefresh();
  },

  toApply() {
    wx.navigateTo({
      url: "/pages/application/index"
    });
  },

  getPermission() {
    const that = this;
    //通过云函数获取当前用户的OPENID
    wx.cloud.callFunction({
      name: "getOpenId",
      complete: res => {
        this.setData({
          openIdNew: res.result.OPENID
        });
      }
    });
    //获取云端数据库判断当前用户拥有哪些模块的权限
    const db = wx.cloud.database();
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
              for (let i = 0; i < res.data[0].roles.length; i++) {
                if (res.data[0].roles[i] == "szyd:fc-supervisor") {
                  that.setData({
                    isFcSupervisor: true
                  });
                } else if (res.data[0].roles[i] == "szyd:zq-supervisor") {
                  that.setData({
                    isFaSupervisor: true
                  });
                } else if (res.data[0].roles[i] == "szyd:ecard-supervisor") {
                  that.setData({
                    isEcardSupervisor: true
                  });
                }
              }
            });
        }
      });
  }
});