
/**
 * 对首页需要展示的数据做定时缓存，将数据保存到云数据库中。
 * 部署时需要配置环境变量：
 *  - token: 群组信息接口token,应用账户信息接口token,认证应用信息接口token
 *  - appId: 群组信息接口appId,应用账户信息接口appId，认证应用信息接口appId
 */
const cloud = require('wx-server-sdk')
const request = require('request-promise');
cloud.init()
const db = cloud.database();
const colIdSystem = db.collection('idSystem');

/**
 * 更新或新建键值对
 */
const updateOrAddKv = async (key, value) => {
  if (await doesKeyExist(key)) {
    await colIdSystem.doc(key).set({
      data: {
        value,
        dateUpdated: new Date(),
      }
    });
  } else {
    await colIdSystem.add({
      data: {
        _id: key,
        value,
        dateUpdated: new Date(),
      }
    });
  }
}
/**
 * 检查指定的key是否已存在集合中
 */
const doesKeyExist = async (key) => {
  const result = await colIdSystem.where({
    _id: key
  }).get();
  if (result.data.length) return true;
  else false;
}
/**
 * 群组信息
 * 
 */
const groupInfo = async (event) => {
  const host = "http://apis.ynu.edu.cn/do/api/call/qz_tysfrz";
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  const appId = process.env.appId;
  let options = {
    uri: `${host}`,
    method: 'POST',
    json: true,
    headers: {
      "accessToken": token,
      "appId": appId,
      "Content-Type": "application/json"
    },
    body: {}
  };
  try {
    return await request(options);
  } catch (err) {
    return {
      ret: -1,
      msg: err
    };
  }
}
const updateGroupInfo = async () => {
  const res = await groupInfo();
  const info = res.dataSet || [];
  await updateOrAddKv('index:group-info', info)
}

/**
 * 应用账户信息
 *
 */
const appAccountInfo = async (event) => {
  const host = "http://apis.ynu.edu.cn/do/api/call/yyzh_tysfrz";
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  const appId = process.env.appId;
  let options = {
    uri: `${host}`,
    method: 'POST',
    json: true,
    headers: {
      "accessToken": token,
      "appId": appId,
      "Content-Type": "application/json"
    },
    body: {}
  };
  try {
    return await request(options);
  } catch (err) {
    return {
      ret: -1,
      msg: err
    };
  }
}
const updateAppAccountInfo = async () => {
  const res = await appAccountInfo();
  const info = res.dataSet || [];
  await updateOrAddKv('index:app-account-info', info)
}

/**
 * 认证应用信息 
 *
*/
const appCertificationInfo = async (event) => {
  const host = "http://apis.ynu.edu.cn/do/api/call/rzyy_tysfrz";
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  const appId = process.env.appId;
  let options = {
    uri: `${host}`,
    method: 'POST',
    json: true,
    headers: {
      "accessToken": token,
      "appId": appId,
      "Content-Type": "application/json"
    },
    body: {}
  };
  try {
    return await request(options);
  } catch (err) {
    return {
      ret: -1,
      msg: err
    };
  }
}
const updateAppCertificationInfo = async () => {
  const res = await appCertificationInfo();
  const info = res.dataSet || [];
  await updateOrAddKv('index:app-certification-info', info)
}

exports.main = async (event, context) => {
  await updateGroupInfo();
  await updateAppAccountInfo();
  await updateAppCertificationInfo();
}