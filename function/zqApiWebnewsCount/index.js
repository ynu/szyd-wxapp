// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const host = 'http://zq-api.ynu.edu.cn';
    //token是由环境变量token1,token2,token3,token4,token5以及.,-组成的，通过云开发控制台，配置此云函数,名分别为token1,token2,token3,token4,token5的键值对环境变量
    const token = `${process.env.token1}.${process.env.token2}.${process.env.token3}-${process.env.token4}-${process.env.token5}`;
    let options = {
      uri: `${host}/api/wbnews/latestDaysUpdateCounts/180?access_token=${token}`,
      json: true
    };
    return await request(options);
  } catch (err) {
    console.log(err);
  }
}