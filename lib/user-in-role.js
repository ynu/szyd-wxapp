/**
 * UIR用户鉴权组件
 * version: 2.0.1
 * 
 * changelog:
 * - 2.0.1
 *    - 修改getUser的bug
 * - 2.0.0
 *    - 修改addUser的URL
 *    - 修改getUser的URL
 *    - 修改detachUser的URL
 *    - 修改addRole的URL
 *    - 修改removeRole的URL
 * - 1.1.1
 *    - 增加URL中的encodeURIComponent
 * 
 * - 1.1.0
 *    - 增加applyList方法
 *    - 增加 removeApply 方法
 * 
 */

const { set, get } = require('./storage');

class UirApi {
  constructor(options = {}) {
    this.appId = options.appId;
    this.host = options.host;
    this.token = options.token;
    this.version = options.version;
  }

  addUser(appId, userId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/users?token=${this.token}`,
        method: 'PUT',
        data: { appId, userId },
        success(res) {
          resolve(res.data);
        },
        fail(res) {
          console.log(res);
        },
      });
    });
  }

  apps() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/apps?token=${this.token}`,
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) { },
      });
    });
  }

  usersByAppId(appId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/by-appid/${encodeURIComponent(appId)}?token=${this.token}`,
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
        },
        fail(res) { },
      });
    });
  }

  getUser(appId, userId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/users?token=${this.token}`,
        data: { appId, userId },
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) {
          reject(res.data);
        },
      });
    });
  }

  attachUser(attachTo, newUser) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/attach/${encodeURIComponent(newUser.appId)}/${encodeURIComponent(newUser.userId)}/to/${encodeURIComponent(attachTo.appId)}/${encodeURIComponent(attachTo.userId)}?token=${this.token}`,
        method: 'POST',
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) { },
      });
    });
  }

  detachUser(appId, userId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/detach?token=${this.token}`,
        data: { appId, userId },
        method: 'DELETE',
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) { },
      });
    });
  }

  addRole(appId, userId, role) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/roles?token=${this.token}`,
        method: 'POST',
        data: { appId, userId, role },
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) { },
      });
    });
  }

  removeRole(appId, userId, role) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/roles?token=${this.token}`,
        method: 'DELETE',
        data: { appId, userId, role },
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) { },
      });
    });
  }

  apply(appId, userId, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/apply/${encodeURIComponent(appId)}/${encodeURIComponent(userId)}?token=${this.token}`,
        method: 'PUT',
        data,
        dataType: 'json',
        responseType: 'text',
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) { },
      });
    });
  }

  applyList() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/apply?token=${this.token}`,
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  }

  removeApply(appId, userId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/apply/${encodeURIComponent(appId)}/${encodeURIComponent(userId)}?token=${this.token}`,
        method: 'DELETE',
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  }
}

module.exports = UirApi;
