/**
 * 研究生API
 */

class YjsApi {

  //通过云函数获取对应条件的研究生数量
  counter(list) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'yjsApiCounter',
        data: list
      }).then(res => {
        resolve(res.result.dataSet[0].RESULT || {})
      }).catch(err => reject(err))
    })
  }
}

module.exports = YjsApi;