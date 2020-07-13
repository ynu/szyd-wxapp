import { ecardApi, shopManagerRolePrefix, meansApi } from '../../utils/utils.js';

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
  onLoad: function(options) {
    // 定义方法：获取当前用户有权限的商户ID列表
    const getShopIds = () => new Promise((resolve, reject) => {
      //获取云端数据库判断当前用户拥有哪些权限
      meansApi.getRoles().then(res => {
        //筛选商户的权限
        let rolesArr = res.data[0].roles.filter(role => {
          return role.indexOf(shopManagerRolePrefix) != -1;
        });
        //分离权限中的商户id
        let shopsIdArr = rolesArr.map(role => {
          return role.substring(19);
        });
        resolve(shopsIdArr);
      })
    });
    wx.showLoading({
      title: '正在加载',
      mask: true,
    });
    Promise.all([
      getShopIds().catch(() => []),
      ecardApi.shops().catch(() => []),
    ]).then(([shopIds, shops]) => {
      // 获取当前用户管理的商户的详细信息
      const myShops = shopIds.map(id => {
        const shop = shops.find((shop) => {
          return shop.shopid == id
        });
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