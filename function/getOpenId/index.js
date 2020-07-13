// index.js
import { init, getWXContext } from 'wx-server-sdk';
init();
export function main(event, context) {
  // 这里获取到的 openId、 appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
  const { OPENID, APPID, UNIONID } = getWXContext()

  return {
    OPENID,
    APPID,
    UNIONID,
  }
}