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
      }).catch(err => reject(err))
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
      }).catch(err => reject(err))
    })
  }
  //各个站点180天内站的文章数量
  webnewsCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'zqApiWebnewsCount'
      }).then(res => {
        resolve(res.result);
      }).catch(err => reject(err))
    })
  }
  shutdownWeb(webs) {
    let down = [];
    let start = [];
    for (let web of webs) {
      if (web.wbstate === "正在使用") {
        start.push(web);
      } else {
        down.push(web);
      }
    }
    start = start.sort(this.done('count', false));
    down = down.sort(this.done('count', false))
    return {
      start,
      down
    };
  }
  done(key, desc) {
    return function(a, b) {　　　　
      return desc ? ((parseInt(a[key]) < parseInt(b[key])) ? 1 : ((parseInt(a[key]) > parseInt(b[key])) ? -1 : 0)) : ((parseInt(a[key]) < parseInt(b[key])) ? -1 : ((parseInt(a[key]) > parseInt(b[key])) ? 1 : 0)) //杠杠的，注意括号就是！
    }
  }
}

module.exports = ZqApi;