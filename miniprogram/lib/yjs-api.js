/**
 * 研究生API
 */
import key from '../utils/key.js';
const app = getApp();

class YjsApi {
  //通过云数据库获取对应条件的研究生数量
  counter() {
    const db = wx.cloud.database();
    return db.collection('yjs').get().then((res) => {
      return res.data[0].yjsCounter;
    }).catch(() => []);
  }
  //通过传递参数发送request请求查询研究生课程表中的信息
  kcbQuery(param) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/kcjbxx_yjs",
        data: param,
        method: "POST",
        header: {
          'accessToken': key.apis.token,
          'appId': key.apis.appId,
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