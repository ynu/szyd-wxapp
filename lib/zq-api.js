/**
 * version: 1.0.1
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
        fail: function (res) {
          reject(res);
        },
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
        fail: function (res) {
          reject(res);
        },
      })
    });
  }
  //站名及其状态
  webFirm() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://zq-api.ynu.edu.cn/api/wbfirm?access_token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200) resolve(res.data);
          else reject(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      })
    });
  }
  //180天内站的文章数量
  webnewsCount() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://zq-api.ynu.edu.cn/api/wbnews/latestDaysUpdateCounts/180?access_token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200) resolve(res.data);
          else reject(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      })
    });
  }

}

module.exports = ZqApi;
