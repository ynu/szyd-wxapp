// 获取卡的总数量云函数入口文件
const cloud = require("wx-server-sdk");
const request = require("request-promise");
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const host = "http://opendoor.api.ynu.edu.cn";
  const id = event.id;
  //token通过获取此云函数的环境变量获得，通过云开发控制台，配置此云函数名为token的键值对环境变量
  const token = process.env.token;
  let options = {
    uri: `${host}/door/opendoor/${id}`,
    json: true,
    headers: {
      "Authorization": token
    }
  };
  try {
    return await request(options);
  } catch (err) {
    return {
      ret: -1,
      msg: err
    };
  }
};
