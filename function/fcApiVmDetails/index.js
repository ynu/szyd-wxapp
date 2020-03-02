// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const host = 'http://fc.api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  //siteId通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为siteId的键值对环境变量
  let siteId = process.env.siteId;
  let vmId = event.vmId;
  let option = {
    uri: `${host}/site/${siteId}/vmResource/${vmId}?token=${token}`,
    json: true,
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