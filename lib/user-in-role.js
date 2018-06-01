/**
 * UIR用户鉴权组件
 * version: 1.0.0
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
        url: `${this.host}/users/${appId}/${userId}?token=${this.token}`,
        method: 'PUT',
        dataType: 'json',
        responseType: 'text',
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
          console.log(res.data.data);
          if (res.data.ret === 0) resolve(res.data.data);
        },
        fail(res) { },
      });
    });
  }

  usersByAppId(appId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/by-appid/${appId}?token=${this.token}`,
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
        url: `${this.host}/users/${appId}/${userId}?token=${this.token}`,
        success(res) {
          if (res.data.ret === 0) resolve(res.data.data);
        },
        fail(res) { },
      });
    });
  }

  attachUser(attachTo, newUser) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/attach/${newUser.appId}/${newUser.userId}/to/${attachTo.appId}/${attachTo.userId}?token=${this.token}`,
        method: 'POST',
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

  detachUser(appId, userId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/detach/${appId}/${userId}?token=${this.token}`,
        header: {},
        method: 'DELETE',
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

  addRole(appId, userId, role) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/roles/${appId}/${userId}/${role}?token=${this.token}`,
        method: 'POST',
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

  removeRole(appId, userId, role) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/roles/${appId}/${userId}/${role}?token=${this.token}`,
        method: 'DELETE',
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

  apply(appId, userId, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/apply/${appId}/${userId}?token=${this.token}`,
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
}

module.exports = UirApi;
