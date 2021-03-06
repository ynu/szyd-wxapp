// 云函数入口文件
import { init } from 'wx-server-sdk';
import request from 'request-promise';
init();

// 云函数入口函数
export async function main(event, context) {
  const host = 'http://ecard.api.ynu.edu.cn';
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  const date = event.date;
  let options = {
    //uri: `${host}/operator/all/daily-bill/${date}?token=${token}`,
    uri: `${host}/operatorBill`,
    json: true,
    method: "POST",
    headers: {
      "Authorization": token
    },
    body: {
      "accdate": date,
    },
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