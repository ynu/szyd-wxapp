const moment = require('./moment');

const VALUE = ':storage:value';
const EXPIRE = ':storage:expire';

// 缓存一个有过期时间的键值对。过期时间单位为秒
const set = (key, value, expire = 86400) => {
  try {
    wx.setStorageSync(`${key}${VALUE}`, value);
    wx.setStorageSync(`${key}${EXPIRE}`, moment().add(expire, 's'));
  } catch(e) {
    return false;
  } 
}

const get = (key) => {
  try {
    const expiredDate = wx.getStorageSync(`${key}${EXPIRE}`);
    
    if (expiredDate) {
      // 如果当前时间在过期时间之前，则数据还未过期
      if (moment().isBefore(expiredDate)) {
        return wx.getStorageSync(`${key}${VALUE}`);
      } else {
        // 数据已经过期，清除数据
        wx.removeStorage(`${key}${EXPIRE}`);
        wx.removeStorage(`${key}${VALUE}`);
        return null;
      }
    } else return null;
  } catch (e) {
    return null;
  }
}

module.exports = {
  set,
  get,
};
