
/**
 * 对首页需要展示的数据做定时缓存，将数据保存到云数据库中。
 * 部署时需要配置环境变量：
 *  - zqtoken: 站群系统Token
 */
const cloud = require('wx-server-sdk')
const request = require('request-promise');
cloud.init()
const db = cloud.database();
const colKvs = db.collection('kvs');

const countZqNews = async () => {
  //zq_token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.zqtoken;
  let options = {
    uri: `http://zq-api.ynu.edu.cn/api/wbnews/count?token=${token}`,
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
 * 更新站群文章数量
 */
const updateZpNewsCount = async () => {
  const res = await countZqNews();
  const { count } = res;
  updateOrAddKv('index:zp-news-count', count);
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
const doesKeyExist = async (key) =>  {
  const result = await colKvs.where({
    _id: key
  }).get();
  if(result.data.length) return true;
  else false;
}
// 云函数入口函数
exports.main = async (event, context) => {
  return await updateZpNewsCount();
}