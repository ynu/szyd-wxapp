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
}

module.exports = YjsApi;