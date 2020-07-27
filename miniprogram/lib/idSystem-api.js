/**
 * version: 1.0.0
 * 统一认证系统API
 */
const app = getApp();
class IdSystemApi {
  //从云数据库获取所有的群组信息
  groupInfo() {
    const db = app.wxp.cloud.database();
    return db.collection('idSystem').where({
      _id: "index:group-info"
    }).get().then((res) => {
      return res.data[0].value || [];
    })
  }
  //从云数据库获取所有的应用账户信息
  appAccount() {
    const db = app.wxp.cloud.database();
    return db.collection('idSystem').where({
      _id: "index:app-account-info"
    }).get().then((res) => {
      return res.data[0].value || [];
    })
  }
  //从云数据库获取所有的认证应用信息
  appCertification() {
    const db = app.wxp.cloud.database();
    return db.collection('idSystem').where({
      _id: "index:app-certification-info"
    }).get().then((res) => {
      return res.data[0].value || [];
    })
  }

  //通过云函数搜索用户群组影射信息
  groupInnuendoInfo(param) {
    return new Promise((resolve, reject) => {
      app.wxp.cloud
        .callFunction({
          name: "idSystemQueryGroupInnuendo",
          data: param
        })
        .then(res => {
          resolve(res.result.dataSet);
        })
        .catch(err => reject(err));
    });
  }
  //通过云函数查询账号基本信息
  basicAccountInfo(param) {
    return new Promise((resolve, reject) => {
      app.wxp.cloud
        .callFunction({
          name: "idSystemQueryBasicAccount",
          data: param
        })
        .then(res => {
          resolve(res.result.dataSet);
        })
        .catch(err => reject(err));
    });
  }
}
module.exports = IdSystemApi;