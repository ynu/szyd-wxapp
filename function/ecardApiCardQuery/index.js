// 搜索卡信息或得返回值云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const host = 'http://ynu-ecard-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  const stuempno = event.data;
  const custname = event.data;
  let options = {
    uri: `${host}/card`,
    method: "POST",
    json: true,
    headers: {
      "Authorization": token
    },
    body: {
      "stuempno": stuempno,
      "custname": custname
    }
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