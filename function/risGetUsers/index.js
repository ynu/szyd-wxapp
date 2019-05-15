/**
 * 用于根据条件返回用户列表，查询参数通过event传递。
 * 具体查询参数可参考：https://access.ynu.edu.cn/shterm/resources/docs/rest/index.html#api-User-GetUsers
 */
const fetch = require('node-fetch');
const qs = require('qs');
const cloud = require('wx-server-sdk')
cloud.init()

// 必须关闭证书验证，否则会报错
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

// 云函数入口函数
exports.main = async (event, context) => {
  const host = 'https://access.ynu.edu.cn/shterm/api';
  try {
    // 1. 获取token
    const auth = await cloud.callFunction({
      name: 'risGetAuthenticate',
    });
    // 如果不能正确获得token, 直接返回错误信息
    if (!auth.result.ST_AUTH_TOKEN) return auth.result; 

    const result = await fetch(`${host}/user?${qs.stringify(event)}`, {
      headers: {
        // token要放到cookie中
        cookie: [ qs.stringify(auth.result) ],
      },
    });
    // 判断并输出结果 
    if (!result.ok) {
      return {
        ret: result.status,
        msg: result.statusText,
      };
    } else return result.json();
  } catch (err) {
    return {
      ret: -1,
      msg: err,
    }
  }
}