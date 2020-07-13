/**
 * version: 1.0.0
 * Rs人事系统API
 */

class RsApi {
  //查询人事基本信息方法
  infoQuery(param) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "rsApiInfoQuery", //通过云函数rsApiInfoQuery获取
          data: param
        })
        .then(res => {
          if (res.result.dataSet) {
            resolve(res.result.dataSet);           
          } else {
            reject(res)
          }
        })
        .catch(err => reject(err));
    });
  }
}
module.exports = RsApi;