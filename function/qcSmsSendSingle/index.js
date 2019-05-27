// 云函数入口文件
const cloud = require('wx-server-sdk');
const QcloudSms = require('qcloudsms_js');
cloud.init();

// 云函数入口函数
exports.main = async(event, context) => {
  // 短信应用SDK AppID，通过云开发控制台，配置此云函数名为appid的键值对环境变量
  let appid = process.env.appId;
  // 短信应用SDK AppKey，通过云开发控制台，配置此云函数名为appkey的键值对环境变量
  let appkey = process.env.appKey;
  // 需要发送短信的手机号码
  let phoneNumbers = [event.mobile];
  // 短信模板ID，需要在短信应用中申请，通过云开发控制台，配置此云函数名为templateId的键值对环境变量
  let templateId = process.env.templateId;
  // 签名
  let smsSign = "云南大学";
  // 实例化QcloudSms
  let qcloudsms = QcloudSms(appid, appkey);
  let ssender = qcloudsms.SmsSingleSender();
  let code = event.code;
  let params = ["数字ITC+小程序", code, 10];
  return new Promise((resolve, reject) => {
    ssender.sendWithParam(86, phoneNumbers[0], templateId,
      params, smsSign, "", "",
      (err, res, resData) => {
        if (err) {
          reject(err);
        } else {
          resolve(resData);
        }
      }
    );
  })

}