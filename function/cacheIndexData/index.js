
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

const cardCount = async () => {
  const host = "http://ynu-ecard-api.ynu.edu.cn";
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token1;
  let options = {
    uri: `${host}/card/summary`,
    //method: 'POST',
    json: true,
    headers: {
      "Authorization": token
    }
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
/**
 * 更新所有发卡的数量
 */
const updateEcardCardCount = async () => {
  const res = await cardCount();
  const count = res.count || 0;
  await updateOrAddKv('index:ecard-card-count', count);
}

const deviceCount = async () => {
  const host = 'http://ynu-ecard-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token1;
  let options = {
    uri: `${host}/device/summary`,
    json: true,
    headers: {
      "Authorization": token
    },
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
 * 更新所有POS机的数量
 */
const updateEcardDeviceCount = async () => {
  const res = await deviceCount();
  const count = res.count || 0;
  await updateOrAddKv('index:ecard-device-count', count);
}


const shopsInfo = async () => {
  const host = 'http://ynu-ecard-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token1;
  let options = {
    uri: `${host}/shop`,
    json: true,
    headers: {
      "Authorization": token
    },
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
 * 更新所有商户的数量
 */
const updateEcardShopsCount = async () => {
  const res = await shopsInfo();
  const count = res.length || 0;
  await updateOrAddKv('index:ecard-shops-count', count);
}

const clustersInfo = async (event) => {
  const host = 'http://fc-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token2;
  //siteId通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为siteId的键值对环境变量
  let siteId = process.env.siteId;
  const siteIdOption = event.siteIdOption;
  siteId = siteIdOption || siteId;
  let options = {
    uri: `${host}/site/${siteId}/cluster?token=${token}`,
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
 * 更新集群的数量
 */
const updateFcClustersCount = async () => {
  const res = await clustersInfo({
    siteIdOption: ''
  });
  const count = res.result.length || 0;
  await updateOrAddKv('index:fc-clusters-count', count);
}

const hostsInfo = async (event) => {
  const host = 'http://fc-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token2;
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

const vmsInfo = async (event) => {
  const host = 'http://fc-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token2;
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

const countWebFirm = async () => {
  const host = 'http://zq-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token3;
  let options = {
    uri: `${host}/api/wbfirm/count?access_token=${token}`,
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
 * 更新站群数量
 */
const updateZqWebFirmCount = async () => {
  const res = await countWebFirm();
  const { count } = res;
  await updateOrAddKv('index:zq-web-firm-count', count);
}

const countZqNews = async () => {
  //zq_token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token3;
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
const updateZqNewsCount = async () => {
  const res = await countZqNews();
  const { count } = res;
  updateOrAddKv('index:zq-news-count', count);
}

const webFirmInfo = async () => {
  const host = 'http://zq-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token3;
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


// 云函数入口函数
exports.main = async (event, context) => {
  await updateEcardCardCount();
  await updateEcardDeviceCount();
  await updateEcardShopsCount();
  await updateFcClustersCount();
  await updateFcHostsCount();
  await updateFcVmsCount();
  await updateZqWebFirmCount();
  await updateZqNewsCount();
  return await updateZqRunningWebFirmCount();
}