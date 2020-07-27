/**
 * 研究生API
 */
import config from '../config.default.js';
const app = getApp();

class YjsApi {
  //通过云数据库获取对应条件的研究生数量
  counter() {
    const db = app.wxp.cloud.database();
    return db.collection('yjs').get().then((res) => {
      return res.data[0].yjsCounter;
    }).catch(() => []);
  }
  //通过传递参数到云函数查询研究生课程表中的信息
  kcbQuery(param) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: config.apis.yjsUrl.yjsKcbQuery,
        data: param,
        method: "POST",
        header: {
          'accessToken': config.apis.token,
          'appId': config.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      })
        .then(res => {
          resolve(res.data.dataSet);
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = YjsApi;