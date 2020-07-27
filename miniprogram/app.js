//app.js
import { promisifyAll, promisify } from 'miniprogram-api-promise';

const wxp = {};
// promisify化所有的wx api
promisifyAll(wx, wxp);
Array.prototype.flatMap = function (lambda) {
  return Array.prototype.concat.apply([], this.map(lambda));
};
App({
  wxp, //让wxp作为全局变量
  onLaunch: function () {
    if (!wxp.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wxp.cloud.init({
        //env: 'szyd',
        traceUser: true
      });
    }
    this.globalData = {};
    // 获取用户信息
    wxp.getSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wxp.getUserInfo().then(res => {
          // 可以将 res 发送给后台解码出 unionId
          this.globalData.userInfo = res.userInfo;
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res);
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
});
