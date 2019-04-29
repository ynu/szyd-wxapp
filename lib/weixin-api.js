const { set, get } = require('./storage');

// 微信相关API
class WeixinApi {
  constructor(options) {
    this.appId = options.appId;
    this.secret = options.secret;
  }
  /*
    根据jscode获取session及openId
    返回示例：
    {
      expires_in: 7200,
      openid: "omnP80NPA7F1DWU6JJk6dGz0p3yw",
      session_key: "jvKqrOwCQevBuZ+30hcL8w==",
    }
  */
  jscode2session(code) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api3.ynu.edu.cn/weixin/jscode2session?appId=${this.appId}&secret=${this.secret}&code=${code}`,
        success: (res) => {
          resolve(res.data);
        },
      });
    })
  }
  getOpenId() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
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
            console.log('WeixinAPI:getOpenId', e.message);
            reject(e);
          }
        },
        fail: res => {
          reject(res);
        }
      });
    })
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
          wx.login({
            success: () => {
              wx.getUserInfo({
                success: res => {
                  // 保存数据到缓存中
                  set(keyUserInfo, res.userInfo, 86400);
                  resolve(res.userInfo);
                },
                fail: res => {
                  console.log('getUserInfo failed:', res);
                  reject(res);
                }
              });
            }
          });
        });
      }
    } catch (e) {
      console.log('getUserInfo failed:', e.message);
      reject(e);
    }
    
  }
}

module.exports = WeixinApi;