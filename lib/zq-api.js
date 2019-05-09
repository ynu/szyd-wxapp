/**
 * version: 1.0.1
 * 站群系统API
 */
class ZqApi {

  firmCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiFirmCount'
      }).then(res => {
        resolve(res.result.count);
      })
    })
  }

  newsCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiNewsCount'
      }).then(res => {
        resolve(res.result.count);
      })
    })
  }
  //站名及其状态
  webFirm() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiWebfirm'
      }).then(res => {
        resolve(res.result);
      })
    })
  }
  //180天内站的文章数量
  webnewsCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiWebnewsCount'
      }).then(res => {
        resolve(res.result);
      })
    })
  }
}

module.exports = ZqApi;