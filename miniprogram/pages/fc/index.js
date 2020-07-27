import {fcApi} from '../../utils/utils.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  goToHost: function (event) {
    app.wxp.navigateTo({
      url: `./host/host?host=${event.currentTarget.dataset.host}`,
    });
  },

  goToVm: function (event) {
    app.wxp.navigateTo({
      url: `./vm/vm?colony=${event.currentTarget.dataset.vm.name}&select=colony`,
    });
  },

  onLoad: function () {
    let vm = [];
    let that = this;
    let host = [];
    app.wxp.showLoading({
      title: '正在加载',
    });
    Promise.all([fcApi.setlist()]).then(vm=>{
      that.setData({
        datas:vm[0]
      });
      app.wxp.hideLoading();
    });
  },
});