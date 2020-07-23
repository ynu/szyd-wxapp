/**
 * 风险防控系统API
 */
const {get, set} = require('./storage');

class RisApi {
  constructor() {}
  // 为避免数据被人从内存读取，暂时不缓存token。
  getToken() {
    const key = 'RIS_ST_AUTH_TOKEN';
  }
  users(options) {
    return wx.cloud.callFunction({
      name: 'risGetUsers',
      data: options,
    });
  }
  usersCount() {
    return this.users({
      size: 1,
    }).then(res => res.result)
  }
}

module.exports = RisApi;