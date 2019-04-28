
const {
  ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles,
} = require('../../utils/utils.js');
var openIdNew;
Page({
  data: {
    isUirManager: false,
    loadingOpenId: true,
    openIdNew,

    bills: [],
    zq: {
      firmCount: 141,
      newsCount: 75334,
    },
    fc: {
      vmCount: 401,
      clusterCount: 5,
      hostCount: 14,
    },
    ecard: {
      shops: [],
      devices: [],
    },
    isFcSupervisor: false,
    isFaSupervisor: false,
    isEcardSupervisor: false,
  },
  initPage() {
    wx.showLoading({
      title: '正在加载',
      mask: true,
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
      weixinApi.getOpenId().catch(() => ''),
    ]).then(([
      bills,
      shops,
      firmCount,
      newsCount,
      vmCount,
      clusters,
      hostCount,
      openId,
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
          newsCount,
        },
        fc: {
          vmCount,
          clusterCount: clusters.length,
          hostCount,
        },
        ecard: {
          shops,
        },
      });

      // 设置权限
      uirApi.getUser(appId, openId).then((uir) => {
        if (uir && uir.roles && uir.roles.length) {
          // this.setData({
          //   isFcSupervisor: uir.roles.includes(Roles.FcSupervisor),
          //   isEcardSupervisor: uir.roles.includes(Roles.EcardSupervisor),
          // });
        }
      }).catch(() => {
        wx.hideLoading();
      });
    }).catch((error) => {
      wx.hideLoading();
    });
  },

  onLoad() {
    this.initPage();
    this.getPermission()
    wx.cloud.callFunction({ //调用云函数
            name: 'fcApi'           //云函数名为http
    }).then(res => { 
      console.log("res,--------",res.result)
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  onPullDownRefresh() {
    console.log('dddddddddd');
    this.initPage();
    wx.stopPullDownRefresh();
  },

  toApply() {
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    wx.navigateTo({
      url: '/pages/fa/index',
    })
    
  },

  getPermission(){
    let that=this
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        this.setData({ openIdNew: res.result.OPENID });
      }
    })
    const db = wx.cloud.database()
    db.collection('user-permissions').doc(that.data.openIdNew).get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data.roles)
      for(let i=0;i<res.data.roles.length;i++){
        if(res.data.roles[i]=="虚拟化平台"){
          that.setData({isFcSupervisor:true})
        }else if(res.data.roles[i]=="站群系统"){
          that.setData({isFaSupervisor:true})
        }else if(res.data.roles[i]=="一卡通"){
          that.setData({isEcardSupervisor:true})
        }
      }
    })
  }
});
