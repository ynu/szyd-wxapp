/**
 * version: 1.0.0
 * FC虚拟化平台API
 */

class FcApi {
  constructor(options) {
    this.host = options.host;
    this.token = options.token;
    this.siteId = options.siteId;
  }

  vms(options = {}) {
    let { siteId, limit, offset } = options;
    siteId = siteId || this.siteId;
    limit = limit || 20;
    offset = offset || 0;

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/site/${siteId}/vmResource/?limit=${limit}&offset=${offset}&token=${this.token}`,
        success: function(res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail: function(res) {},
      });
    });
  }

  vmCount() {
    return this.vms({ limit: 0 }).then(vms => {
      return vms.total;
    });
  }

  clusters(options = {}) {
    let { siteId } = options;
    siteId = siteId || this.siteId;

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/site/${siteId}/cluster?token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail: function (res) { },
      });
    });
  }

  hosts(options = {}) {
    let { siteId, limit, offset } = options;
    siteId = siteId || this.siteId;
    limit = limit || 20;
    offset = offset || 0;

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/site/${siteId}/hostResource/?limit=${limit}&offset=${offset}&token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail: function (res) { },
      });
    });
  }

  hostCount() {
    return this.hosts({ limit: 0 }).then(hosts => {
      return hosts.total;
    });
  }
}

module.exports = FcApi;
