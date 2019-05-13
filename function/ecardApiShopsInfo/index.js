// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const host = 'http://ecard-api.ynu.edu.cn';
    //token是由环境变量token1,token2,token3以及.组成的，通过云开发控制台，配置此云函数名分别为token1,token2,token3的键值对环境变量
    const token = `${process.env.token1}.${process.env.token2}.${process.env.token3}`;
    let options = {
      uri: `${host}/shop/all?token=${token}`,
      json: true
    };
    return await request(options);
  } catch (err) {
    console.log(err);
  }
}