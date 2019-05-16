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
  // 从参数获取token
  let { st_auth_token } = event;

  if (!st_auth_token) { // 如果参数为提供token，则从远程获取
    try {
      // 获取token
      const auth = await cloud.callFunction({
        name: 'risGetAuthenticate',
      });
      // 如果不能正确获得token, 直接返回错误信息
      if (!auth.result.ST_AUTH_TOKEN) return auth.result;
      st_auth_token = auth.result.ST_AUTH_TOKEN;
    } catch (err) {
      return {
        ret: -1,
        msg: err,
      }
    }
  }
  // 获取用户列表
  try {
    const result = await fetch(`${host}/user?${qs.stringify(event)}`, {
      headers: {
        // token要放到cookie中
        cookie: [ `ST_AUTH_TOKEN=${st_auth_token}` ],
      },
    });
    // 判断并输出结果 
    if (!result.ok) {
      return {
        ret: result.status,
        msg: result.statusText,
      };
    } else {
      // 返回成功，数据内容太多，只返回需要的字段
      users = await  result.json();
      return {
        ...users,
        content: users.content.map(user => ({
          id: user.id,
          loginName: user.loginName,
          userName: user.userName,
          authType: {
            id: user.authType.id,
            name: user.authType.name,
            type: user.authType.type,
          },
          role: {
            id: user.role.id,
            description: user.role.description,
          },
          state: user.state,
          enabled: user.enabled,
        })),
      };
    }
  } catch (err) {
    return {
      ret: -1,
      msg: err,
    }
  }
}