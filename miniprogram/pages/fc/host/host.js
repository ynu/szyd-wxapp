import {fcApi} from '../../../utils/utils.js';
const app = getApp();

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
    app.wxp.showLoading({
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
          app.wxp.hideLoading();
        });
      }
    });

  },
  goToVm: function (event) {
    app.wxp.navigateTo({
      url: `../vm/vm?host=${event.currentTarget.dataset.host}&select=host`,
    });
  },


});