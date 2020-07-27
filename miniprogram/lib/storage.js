/*
version: 0.3.1

changelog:

- 0.3.1: 修复remove的bug
*/
import moment from './moment';
const app = getApp();
const VALUE = ':storage:value';
const EXPIRE = ':storage:expire';

// 缓存一个有过期时间的键值对。过期时间单位为秒
const set = (key, value, expire = 86400) => {
  try {
    app.wxp.setStorageSync(`${key}${VALUE}`, value);
    app.wxp.setStorageSync(`${key}${EXPIRE}`, moment().add(expire, 's'));
  } catch (e) {
    return false;
  }
};

const get = (key) => {
  try {
    const expiredDate = app.wxp.getStorageSync(`${key}${EXPIRE}`);

    if (expiredDate) {
      // 如果当前时间在过期时间之前，则数据还未过期
      if (moment().isBefore(expiredDate)) {
        return app.wxp.getStorageSync(`${key}${VALUE}`);
      }
      // 数据已经过期，清除数据
      remove(`${key}${EXPIRE}`);
      remove(`${key}${VALUE}`);
      return null;
    } return null;
  } catch (e) {
    return null;
  }
};

const has = key => !!app.wxp.getStorageSync(key);

const remove = key => {
  if (has(key)) {
    app.wxp.removeStorageSync(`${key}${EXPIRE}`);
    app.wxp.removeStorageSync(`${key}${VALUE}`);
  }

}

export default {
  set,
  get,
  has,
  remove,
};