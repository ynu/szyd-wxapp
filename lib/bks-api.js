/**
 * 本科生API
 */

class BksApi {
  //通过云数据库获取对应条件的研究生数量
  counter() {
    const db = wx.cloud.database();
    return db.collection('bks').get().then((res) => {
      return res.data[0].bksCounter;
    }).catch(() => []);
  }
  //通过传递参数到云函数查询排课时间教师表中的信息
  courseSchedulingTeacherInfoQuery(param) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "bksApiCourseSchedulingTeacherInfoQuery",
          data: {
            data: param
          }
        })
        .then(res => {
          resolve(res.result.dataSet);
        })
        .catch(err => reject(err));
    });
  }
}


module.exports = BksApi;