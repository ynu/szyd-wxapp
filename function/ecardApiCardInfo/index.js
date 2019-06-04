// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const host = 'http://ynu-ecard-api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  const stuempno = event.stuempno;
  let options = {
    uri: `${host}/card/${stuempno}`,
    json: true,
    headers: {
      'Authorization': token
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