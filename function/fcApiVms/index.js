// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const host = 'http://fc-api.ynu.edu.cn/';
  const token = `${process.env.token1}.${process.env.token2}.${process.env.token3}`;
  let siteId = process.env.siteId;
  let siteIdOptions = event.siteIdOptions;
  let limit = event.limit;
  let offset = event.offset;
  siteId = siteIdOptions || siteId;
  limit = limit || 20;
  offset = offset || 0;
  return await new Promise((resolve, reject) => {
    let option = {
      uri: `${host}/site/${siteId}/vmResource/?limit=${limit}&offset=${offset}&token=${token}`,
      json: true
    };
    resolve(request(option).then((repos) => {
      return repos.result
    }));
  });
}