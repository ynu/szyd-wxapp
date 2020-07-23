/**
 * 本科生API
 */
import config from '../config.default.js';
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
  courseSchedulingTeacherInfoQuery(param) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: config.apis.bksUrl.bksCourseSchedulingTeacherInfoQuery,
        data: param,
        method: "POST",
        header: {
          'accessToken': config.apis.token,
          'appId': config.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      }).then(res => {
        resolve(res.data.dataSet)
      }).catch(err => {
        reject(err)
      })
    })
  }
  //此函数用来获取本科生课程表信息
  kcbQuery(param) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: config.apis.bksUrl.bksKcbQuery,
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


module.exports = BksApi;