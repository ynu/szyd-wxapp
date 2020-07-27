import { set, get } from './storage';
const app = getApp();
// 微信相关API
class WeixinApi {
  constructor(options) {
  }
  jscode2session(code) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: `https://api3.ynu.edu.cn/weixin/jscode2session?appId=${this.appId}&secret=${this.secret}&code=${code}`,
      }).then((res) => {
        resolve(res.data);
      }).catch(err => {
        reject(err)
      });
    });
  }

  getOpenId() {
    return new Promise((resolve, reject) => {
      app.wxp.login().then(res => {
        const code = res.code;
        const keyOpenId = 'weixin:openid';
        try {
          let openid = get(keyOpenId);
          if (openid) resolve(openid);
          else {
            this.jscode2session(code).then((data) => {
              set(keyOpenId, data.openid, 86400);
              resolve(data.openid);
            });
          }
        } catch (e) {
          reject(e);
        }
      }).catch(err => {
        reject(err);
      })
    });
  }
  /*
    获取当前用户基本信息
  */
  getUserInfo() {
    try {
      const keyUserInfo = 'weixin:UserInfo';
      const userInfo = get(keyUserInfo);

      // 如果缓存有数据，则从缓存返回
      if (userInfo) return Promise.resolve(userInfo);
      else {
        new Promise((resolve, reject) => {
          // 调用getUserInfo之前必须先调用login
          app.wxp.login().then(() => {
            app.wxp.getUserInfo.then(res => {
              // 保存数据到缓存中
              set(keyUserInfo, res.userInfo, 86400);
              resolve(res.userInfo);
            }).catch(err => {
              reject(err);
            });
          })
        });
      }
    } catch (e) {
      reject(e);
    }
  }
}
module.exports = WeixinApi;