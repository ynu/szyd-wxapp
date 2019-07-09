// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init();
const db = cloud.database();
const colKvs = db.collection('kvs');

const webFirmInfo = async () => {
  const host = 'http://zq-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  let options = {
    uri: `${host}/api/wbfirm?access_token=${token}`,
    json: true
  };
  try {
    return await request(options);
  } catch (err) {
    return {
      ret: -1,
      msg: err,
    }
  }
}

/**
 * 更新正在运行站群的数量
 */
const updateZqRunningWebFirmCount = async () => {
  const res = await webFirmInfo();
  const count = res.filter(web => {
    return web.wbstate === "0";
  }).length;
  await updateOrAddKv('index:zq-running-firm-count', count);
}

/**
 * 更新或新建键值对
 */
const updateOrAddKv = async (key, value) => {
  if (await doesKeyExist(key)) {
    await colKvs.doc(key).set({
      data: {
        value,
        dateUpdated: new Date(),
      }
    });
  } else {
    await colKvs.add({
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
  const result = await colKvs.where({
    _id: key
  }).get();
  if (result.data.length) return true;
  else false;
}
// 云函数入口函数
exports.main = async (event, context) => {
  await updateZqRunningWebFirmCount();
  return await webFirmInfo();
}