// 搜索卡信息或得返回值云函数入口文件
import { init } from 'wx-server-sdk';
import request from 'request-promise';
init();

// 云函数入口函数
export async function main(event, context) {
  const host = 'http://apis.ynu.edu.cn/do/api/call/zhjbxx_tysfrz';
  //token,appId通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token,appId的键值对环境变量
  const token = process.env.token;
  const appId = process.env.appId;
  let options = {
    uri: `${host}`,
    method: "POST",
    json: true,
    headers: {
      "accessToken": token,
      "appId": appId,
      "Content-Type": "application/json"
    },
    body: event
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