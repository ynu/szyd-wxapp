/**
 * version: 1.0.0
 * 站群系统API
 */
class ZqApi {
  constructor(options) {
    this.host = options.host;
    this.token = options.token;
  }

  firmCount() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/wbfirm/count?token=${this.token}`,
        success: function(res) {
          if (res.statusCode === 200) resolve(res.data.count);
          else reject(res.data);
        },
        fail: function(res) {},
      })
    });
  }

  newsCount() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/wbnews/count?token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200) resolve(res.data.count);
          else reject(res.data);
        },
        fail: function (res) { },
      })
    });
  }
}

module.exports = ZqApi;
