// 云函数入口文件
const cloud = require('wx-server-sdk');
const QcloudSms = require('qcloudsms_js');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  // 短信应用SDK AppID
  let appid = process.env.appId;  // SDK AppID是1400开头
  // 短信应用SDK AppKey
  let appkey = process.env.appKey;
  // 需要发送短信的手机号码
  let phoneNumbers = [event.mobile];
  // 短信模板ID，需要在短信应用中申请
  let templateId = process.env.templateId;  
  // 签名
  let smsSign = "云南大学";
  // 实例化QcloudSms
  let qcloudsms = QcloudSms(appid, appkey);
  let ssender = qcloudsms.SmsSingleSender();
  let code = event.code;
  let params = ["站群", code, 10];
  function callback(err, res, resData) {
    if (err) {
      console.log("err: ", err);
    } else {
      console.log("request data: ", res.req);
      console.log("response data: ", resData);
    }
  } 
  ssender.sendWithParam(86, phoneNumbers[0], templateId,
    params, smsSign, "", "", callback);  // 签名参数未提供或者为空时，会使用默认签名发送短信
  return {
    verificationCode: params[1]
  }
}