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
}

module.exports = BksApi;