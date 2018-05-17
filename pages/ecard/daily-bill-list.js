const { uirApi, weixinApi, ecardApi, appId } = require('../../utils/utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalShops: 0,
    shops: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 定义方法：获取当前用户有权限的商户ID列表
    const getShopIds = () => new Promise((resolve, reject) => {
      // 获取OpenId
      weixinApi.getOpenId().then(openid => {
        // 获取当前用户的角色信息
        uirApi.getUser(appId, openid).then(me => {
          // 获取当前用户有权限访问的商户ID列表
          const shopIds = me.roles
            // 找出用户所拥有的商户管理员角色
            .filter(role => role.startsWith('ecard:shop-manager:'))
            // 从角色取出商户ID
            .map(role => role.replace('ecard:shop-manager:', ''));
          resolve(shopIds);
        })
      });
    });

    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    Promise.all([getShopIds(), ecardApi.shops()]).then(([shopIds, shops]) => {
      // 获取当前用户管理的商户的详细信息
      const myShops = shopIds.map(id => {
        const shop = shops.find(({shopId}) => shopId == id);
        return shop || {};
      });
      this.setData({
        shops: myShops,
        totalShops: myShops.length,
      });
      wx.hideLoading();
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