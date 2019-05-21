const {
  Roles,
  shopManagerRolePrefix
} = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEcardSupervisor: false,//当前用户是否拥有一卡通所有模块权限
    isEcardOprator: false//当前用户是否拥有日账单查询权限
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    const db = wx.cloud.database();
    //获取当前用户的数据库权限
    db.collection('user-permissions')
      .where({
        _openid: options.openId
      })
      .get()
      .then(res => {
        const roles = {};
        res.data[0].roles.forEach(role => {
          switch (role) {
            case Roles.EcardSupervisor:
              roles.isEcardSupervisor = true;
              break;
            default:
            //判断当前用户对此页面按钮的权限
              if (role.indexOf(shopManagerRolePrefix) != -1) {
                roles.isEcardOprator = true;
              }
          }
        })
        if(roles.isEcardSupervisor){
          roles.isEcardOprator = false
        }
        that.setData(roles);
      })
  },

  toDailyBill() {
    wx.navigateTo({
      url: '/pages/ecard/daily-bill-list',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  toOperatorBill() {
    wx.navigateTo({
      url: '/pages/ecard/operator-bill-list',
    })
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