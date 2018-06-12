const {
  ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles,
} = require('../../../utils/utils.js');

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
    var that = this;
    Promise.all([fcApi.SelectHostForClusters(options.host)]).then(hosts => {
      for (let host of hosts[0]) {
        host.vmcount=0;
        Promise.all([fcApi.SelectVmForHost(host.name)]).then(vm => {
          host.vmcount = vm[0].length;
          that.setData({
            datas:hosts[0]
          });
        });
      }
    });

  },
  goToVm: function (event) {
    console.log(event);
    wx.navigateTo({
      url: `../vm/vm?host=${event.currentTarget.dataset.host}&select=host`,
    });
  },


});