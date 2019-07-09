// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init();
const db = cloud.database();
const colKvs = db.collection('kvs');

const vmsInfo = async (event) => {
  const host = 'http://fc-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  // const token = `${process.env.token1}.${process.env.token2}.${process.env.token3}`
  const token = process.env.token;
  //siteId通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为siteId的键值对环境变量
  let siteId = process.env.siteId;
  let limit = event.limit;
  let siteIdOptions = event.siteIdOptions;
  let offset = event.offset;
  siteId = siteIdOptions || siteId;
  limit = limit || 20;
  offset = offset || 0;
  let option = {
    uri: `${host}/site/${siteId}/vmResource/?limit=${limit}&offset=${offset}&token=${token}`,
    json: true
  };
  try {
    return await request(option);
  } catch (err) {
    return {
      ret: -1,
      msg: err,
    }
  }
}
/**
 * 更新正在运行的虚拟机数量
 */
const runningCount = async (count) => {
  let runningCount = 0;
  let vms = [];
  let vmall = [];
  for (let offset = 0; offset < count; offset += 100) {
    let vmsinfo = await vmsInfo({
      siteId: 1,
      limit: 100,
      offset: offset
    })
    vms.push(vmsinfo);
  }
  for (let vm of vms) {
    vmall = vmall.concat(vm.result.list);
  }
  runningCount = vmall.filter(vm => {
    return vm.status === "running";
  }).length;
  await updateOrAddKv('index:fc-running-vms-count', runningCount);
}
/**
 * 更新所有虚拟机的数量
 */
const updateFcVmsCount = async () => {
  const res = await vmsInfo({
    limit: 1
  });
  const count = res.result.total || 0;
  await runningCount(count);
  await updateOrAddKv('index:fc-vms-count', count);
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
  return result.data.length > 0
}
// 云函数入口函数
exports.main = async (event, context) => {
  await updateFcVmsCount();
}