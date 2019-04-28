// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise');

cloud.init();

exports.main = async (event, context) => {
  try {
    const options = {
      uri: 'http://fc-api.ynu.edu.cn/site/3F7B07E2/cluster',
      qs: {
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGkiLCJyb2xlcyI6WyJ1c2VyIiwiYWRtaW4iXSwiaWF0IjoxNTI2MzY1Njg0fQ.A_3pkezSAe4jXa6HnKuiErZ5rI4kfRxeHvaTrPAiDEY'
      },
      json: true // Automatically parses the JSON string in the response
    };
    const res = await request(options)
    console.info(`res: ${JSON.stringify(res)}`)
    return JSON.stringify(res)
  } catch (err) {
    console.info(`err: ${err}`)
    return JSON.stringify(err)
  }
}