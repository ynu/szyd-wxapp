/**
 * version: 1.0.2
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
        success(res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  }

  vmCount() {
    return this.vms({ limit: 1 }).then(vms => vms.total);
  }

  clusters(options = {}) {
    let { siteId } = options;
    siteId = siteId || this.siteId;

    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/site/${siteId}/cluster?token=${this.token}`,
        success(res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail(res) {
          reject(res);
        },
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
        success(res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  }

  hostCount() {
    return this.hosts({ limit: 1 }).then(hosts => hosts.total);
  }
}

module.exports = FcApi;
