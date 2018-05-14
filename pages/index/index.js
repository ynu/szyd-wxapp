// const { uirApi, getOpenId, appId, isUirManager } = require('../../utils/util.js');

Page({
  data: {
    isUirManager: false,
    loadingOpenId: true,
  },

  onLoad() {
  },
  
  toUir: () => {
    wx.navigateTo({
      url: '/pages/uir/app-list',
    });
  },
});
