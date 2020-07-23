/**
 * version: 1.0.0
 * Rs人事系统API
 */
import config from '../config.default.js';
const app = getApp();
class RsApi {
  //查询人事基本信息方法
  infoQuery(param) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: config.apis.rsUrl.rsInfoQuery,
        data: param,
        method: "POST",
        header: {
          'accessToken': config.apis.token,
          'appId': config.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      })
        .then(res => {
          if (res.data.dataSet) {
            resolve(res.data.dataSet);
          } else {
            reject(res)
          }
        })
        .catch(err => reject(err));
    });
  }
}
module.exports = RsApi;