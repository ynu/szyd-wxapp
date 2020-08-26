/**
 * 本科生API
 */
import key from '../utils/key';
const app = getApp();
class BksApi {
  //通过云数据库获取对应条件的研究生数量
  async counter() {
    const db = wx.cloud.database();
    try {
      const res = await db.collection('bks').get();
      return res.data[0].bksCounter;
    }
    catch (e) {
      return [];
    }
  }
  //此函数用来获取排课时间教师信息查询
  async courseSchedulingTeacherInfoQuery(param) {
    try {
      const res = await app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/pksjjs_bks",
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
  //此函数用来获取本科生课程表信息
  async kcbQuery(param) {
    try {
      const res = await app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/kcb_bks",
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


module.exports = BksApi;