import { Roles, shopManagerRolePrefix, meansApi } from "../../utils/utils.js";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isEcardSupervisor: false, //当前用户是否拥有一卡通所有模块权限
    isEcardOprator: false //当前用户是否拥有日账单查询权限
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    app.wxp.showLoading({
      title: "正在加载",
      mask: true
    });
    //获取当前用户的数据库权限
    meansApi.getRoles().then(res => {
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
      });
      that.setData(roles);
      app.wxp.hideLoading();
    });
  },

  toDailyBill() {
    app.wxp.navigateTo({
      url: "/pages/ecard/daily-bill-list"
    })
  },
  toMonthlyBill() {
    app.wxp.navigateTo({
      url: "/pages/ecard/monthly-bill-list"
    })
  },
  toOperatorBill() {
    app.wxp.navigateTo({
      url: "/pages/ecard/operator-bill-list"
    });
  },
  toUir() {
    app.wxp.navigateTo({
      url: "/pages/ecard/query/index"
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
});
