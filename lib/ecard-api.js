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
        method: 'GET',
        success: function (res) {
          if (res.data.ret === 0) {
            resolve(res.data.data);
          } else reject(res.data);
        },
      });
    });
  }
}

module.exports = EcardApi;