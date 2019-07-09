// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init();
const db = cloud.database();
const colKvs = db.collection('kvs');

const hostsInfo = async (event) => {
  const host = 'http://fc-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  //siteId通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为siteId的键值对环境变量
  let siteId = process.env.siteId;
  const siteIdOptions = event.siteIdOptions;
  let limit = event.limit;
  let offset = event.offset;
  siteId = siteIdOptions || siteId;
  limit = limit || 20;
  offset = offset || 0;
  let options = {
    uri: `${host}/site/${siteId}/hostResource/?limit=${limit}&offset=${offset}&token=${token}`,
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
 * 更新所有虚拟机的数量
 */
const updateFcHostsCount = async () => {
  const res = await hostsInfo({
    limit: 1
  });
  const count = res.result.total || 0;
  await updateOrAddKv('index:fc-hosts-count', count);

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
  await updateFcHostsCount();
  return await hostsInfo(event);
}