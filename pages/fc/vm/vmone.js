import { fcApi } from '../../../utils/utils.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let vmId = options.vmUrn.split(":")[4];
    wx.showLoading({
      title: '正在加载',
    })
    Promise.all([fcApi.vmDetails(vmId)]).then(res => {
      that.setData({
        vmInfo: res[0]
      });
      wx.hideLoading();
    })
  },
});