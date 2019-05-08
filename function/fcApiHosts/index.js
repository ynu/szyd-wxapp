// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const host = 'http://fc-api.ynu.edu.cn/';
  //token是由环境变量token1,token2,token3以及.组成的，通过云开发控制台，配置此云函数名分别为token1,token2,token3的键值对环境变量
  const token = `${process.env.token1}.${process.env.token2}.${process.env.token3}`;
  //siteId通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为siteId的键值对环境变量
  let siteId = process.env.siteId;
  const siteIdOptions = event.siteIdOptions;
  let limit = event.limit;
  let offset = event.offset;
  siteId = siteIdOptions || siteId;
  limit = limit || 20;
  offset = offset || 0;
  return await new Promise((resolve, reject) => {
    let options = {
      uri: `${host}/site/${siteId}/hostResource/?limit=${limit}&offset=${offset}&token=${token}`,
      json: true
    };
    resolve(request(options).then((repos) => {
      return repos.result
    }));
  });
}