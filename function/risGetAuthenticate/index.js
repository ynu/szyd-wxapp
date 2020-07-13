/**
 * 用于根据用户名和密码获取堡垒机操作token。
 * 部署在云端时，需配置username和password两个环境变量。
 */

import fetch from 'node-fetch';

// 必须关闭证书认证，否则会报错
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

// 云函数入口函数
export async function main(event, context) {
  const host = 'https://access.ynu.edu.cn/shterm/api';
  try {
    const result = await fetch(`${host}/authenticate`, {
      method: 'post',
      body: JSON.stringify({
        // 从环境变量中获取用户名和密码
        username: process.env.username,
        password: process.env.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
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