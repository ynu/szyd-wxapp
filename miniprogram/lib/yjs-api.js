/**
 * 研究生API
 */
import key from '../utils/key.js';
const app = getApp();

class YjsApi {
  //通过云数据库获取对应条件的研究生数量
  async counter() {
    const db = wx.cloud.database();
    try {
      const res = await db.collection('yjs').get();
      return res.data[0].yjsCounter;
    }
    catch (e) {
      return [];
    }
  }
  //通过传递参数发送request请求查询研究生课程表中的信息
  async kcbQuery(param) {
    try {
      const res = await app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/kcjbxx_yjs",
        data: param,
        method: "POST",
        header: {
          'accessToken': key.apis.token,
          'appId': key.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      });
      return res.data.dataSet;
    }
    catch (err) {
      return err;
    }
  }
  //此方法用来获取研究生基本信息
  async yjsInfo(param) {
    try {
      const res = await app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/query_yjs",
        data: param,
        method: "POST",
        header: {
          'accessToken': key.apis.token,
          'appId': key.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      });
      return res.data.dataSet;
    }
    catch (err) {
      return err;
    }
  }
}

module.exports = YjsApi;