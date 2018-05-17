class EcardApi {
  constructor(options) {
    this.host = options.host;
    this.token = options.token;
  }

  // 获取所有商户信息
  shops() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/shop/all?token=${this.token}`,
        success: function (res) {
          if (res.data.ret === 0) {
            resolve(res.data.data);
          } else reject(res.data);
        },
      });
    });
  }

  dailyBills(shopId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/shop/${shopId}/daily-bill?token=${this.token}`,
        success: function(res) {
          if(res.data.ret === 0) resolve(res.data.data);
          else reject(res.data);
        },
        fail: function(res) {},
      })
    })
  }
}

module.exports = EcardApi;