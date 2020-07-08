import { ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles } from '../../../utils/utils.js';

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
    wx.showLoading({
      title: '正在加载',
    });
    Promise.all([fcApi.SelectHostForClusters(options.host)]).then(hosts => {
      for (let host of hosts[0]) {
        host.vmcount=0;
        Promise.all([fcApi.SelectVmForHost(host.name)]).then(vm => {
          host.vmcount = vm[0].length;
          that.setData({
            datas:hosts[0]
          });
          wx.hideLoading();
        });
      }
    });

  },
  goToVm: function (event) {
    wx.navigateTo({
      url: `../vm/vm?host=${event.currentTarget.dataset.host}&select=host`,
    });
  },


});