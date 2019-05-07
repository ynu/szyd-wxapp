// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const host = 'http://fc-api.ynu.edu.cn/';
  const token = `${process.env.token1}.${process.env.token2}.${process.env.token3}`;
  let siteId = process.env.siteId;
  const siteIdOptions = event.siteIdOptions;
  let limit = event.limit;
  let offset = event.offset;
  siteId = siteIdOptions || siteId;
  limit = limit || 20;
  offset = offset || 0;
  return new Promise((resolve, reject) => {
    let options = {
      uri: `${host}/site/${siteId}/hostResource/?limit=${limit}&offset=${offset}&token=${token}`,
      json: true
    };
    resolve(request(options).then((repos) => {
      return repos.result
    }));
  });
}