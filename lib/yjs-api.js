/**
 * 研究生API
 */

class YjsApi {
  //通过云数据库获取对应条件的研究生数量
  counter() {
    const db = wx.cloud.database();
    return db.collection('yjs').get().then((res) => {
      return res.data[0].yjsCounter;
    }).catch(() => []);
  }
  //通过传递参数到云函数查询研究生课程表中的信息
  kcbQuery(param) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "yjsApiKcbQuery",
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

module.exports = YjsApi;