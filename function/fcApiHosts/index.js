// 云函数入口文件
import { init } from 'wx-server-sdk';
import request from 'request-promise';
init();

// 云函数入口函数
export async function main(event, context) {
  const host = 'http://fc.api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
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