// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const host = 'http://zq-api.ynu.edu.cn';
    //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
    const token = process.env.token;
    let options = {
      uri: `${host}/api/wbfirm/count?access_token=${token}`,
      json: true
    };
    return await request(options);
  } catch (err) {
    console.log(err);
  }
}