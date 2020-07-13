// 云函数入口文件
import { init } from 'wx-server-sdk';
import request from 'request-promise';
init();

// 云函数入口函数
export asyncfunction main(event, context) {
  const host = 'http://zq.api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  let options = {
    uri: `${host}/api/wbnews/latestDaysUpdateCounts/180?access_token=${token}`,
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