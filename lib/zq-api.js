/**
 * version: 1.0.1
 * 站群系统API
 */
class ZqApi {
  //总的站点数目
  firmCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiFirmCount'
      }).then(res => {
        resolve(res.result.count);
      }).catch( err => {
        console.log(err)
        reject(err)
      })
    });
  }
  //总的文章数目
  newsCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiNewsCount'
      }).then(res => {
        resolve(res.result.count);
        }).catch(err => reject(err))
    })
  }
  //所有站名及其状态
  webFirm() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiWebfirm'
      }).then(res => {
        resolve(res.result);
      })
    })
  }
  //各个站点180天内站的文章数量
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