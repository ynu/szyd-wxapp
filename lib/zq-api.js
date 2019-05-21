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

  //计算正在使用的站点的数量
  runningCount() {
    return new Promise((resolve, reject) => {
      this.webFirm().then(res => {
        let count = res.filter(web => {
          return web.wbstate === "0";
        }).length;
        resolve(count);
      }).catch(err => {
        reject(err);
      });
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

  //此方法返回已停用和正在使用的排好序的数组对象
  shutdownWeb(webs) {
    let down = []; //已经停用的web站点对象数组
    let start = []; //正在使用的web站点对象数组
    for (let web of webs) {
      if (web.wbstate === "正在使用") {
        start.push(web);
      } else {
        down.push(web);
      }
    }
    start = start.sort(this.done('count', false)); //将start数组对象按照文章的数量排序
    down = down.sort(this.done('count', false)) //将down数组对象按照文章的数量排序
    return {
      start,
      down
    };
  }

  //为一个对象数组里面对象的某一个属性（key）排序，并最后输出排序好的数组。key是对象数组中对象根据此属性名排序，desc当为false时是升序排序，当为true时是降序排序
  done(key, desc) {
    return function(a, b) {　　　　
      return desc ? ((parseInt(a[key]) < parseInt(b[key])) ? 1 : ((parseInt(a[key]) > parseInt(b[key])) ? -1 : 0)) : ((parseInt(a[key]) < parseInt(b[key])) ? -1 : ((parseInt(a[key]) > parseInt(b[key])) ? 1 : 0))
    }
  }
}

module.exports = ZqApi;