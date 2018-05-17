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
        success: function(res) {
          resolve(res.data);
        },
        fail: function(res) {
          console.log(res);
        },
      });
    });
  }

  apps() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/apps?token=${this.token}`,
        success: function(res) {
          console.log(res.data.data)
          if (res.data.ret === 0) resolve(res.data.data);
        },
        fail: function(res) {},
      })
    })
  }

  usersByAppId(appId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/by-appid/${appId}?token=${this.token}`,
        success: function (res) {
          if (res.data.ret === 0) resolve(res.data.data);
        },
        fail: function (res) { },
      })
    })
  }

  getUser(appId, userId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/users/${appId}/${userId}?token=${this.token}`,
        success: function (res) {
          if (res.data.ret === 0) resolve(res.data.data);
        },
        fail: function (res) { },
      })
    })
  }

  attachUser(attachTo, newUser) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/attach/${newUser.appId}/${newUser.userId}/to/${attachTo.appId}/${attachTo.userId}?token=${this.token}`,
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail: function(res) {},
      })
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
        success: function (res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail: function (res) { },
      })
    });
  }

  addRole(appId, userId, role) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/roles/${appId}/${userId}/${role}?token=${this.token}`,
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail: function (res) { },
      })
    })
  }

  removeRole(appId, userId, role) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/roles/${appId}/${userId}/${role}?token=${this.token}`,
        method: 'DELETE',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail: function (res) { },
      })
    })
  }

  apply(appId, userId, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/apply/${appId}/${userId}?token=${this.token}`,
        method: 'PUT',
        data,
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail: function (res) { },
      })
    })
  }
  
}

module.exports = UirApi;