/**
 * version: 1.0.0
 * 一卡通系统API
 */
import keys from '../utils/key';
const app = getApp();
const {
  get,
  set
} = require("./storage.js");

class EcardApi {
  // 获取所有商户信息
  async shops() {
    try {
      const res = await app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/shops_ecard",
        data: {},
        method: "POST",
        header: {
          'accessToken': keys.apis.token,
          'appId': keys.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      })
      return res.data.dataSet
    } catch (err) {
      return err
    }
  }

  //商户数量
  async shopsCount() {
    const db = wx.cloud.database();
    const res = await db.collection('kvs').where({
      _id: "index:ecard-shops-count"
    }).get();
    return res.data[0].value || 0;
  }

  // 获取指定商户单日账单
  dailyBill(queryObject) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/shopBill_ecard",
        method: "POST",
        data: queryObject,
        header: {
          'accessToken': keys.apis.token,
          'appId': keys.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      }).then(res => {
        resolve(res.data.dataSet || []);
      }).catch(err => reject(err))
    });
  }

  // 获取指定商户单月账单
  monthlyBill(queryObject) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/shopBillMonth_ecard",
        method: "POST",
        data: queryObject,
        header: {
          'accessToken': keys.apis.token,
          'appId': keys.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      }).then(res => {
        resolve(res.data.dataSet || []);
      }).catch(err => reject(err))
    });
  }

  // 获取指定日期所有商户的日账单
  dailyBillsByDate(date) {
    const data = {
      accdate: date
    };
    return this.dailyBill({
      accdate: date
    });
  }
  // 获取指定日期所有商户的月账单
  monthlyBillsByDate(date) {
    return this.monthlyBill({
      accdate: date
    });
  }

  // 获取所有子商户指定日期的日账单
  dailyBillsForSubShops(parentShopId, date) {
    return new Promise((resolve, reject) => {
      Promise.all([
        // 获取所有商户指定日期的账单,
        this.dailyBillsByDate(date),
        // 获取所有一级子商户
        this.subShops(parentShopId)
      ]).then(([bills, subShops]) => {
        resolve(
          bills.filter(bill =>
            subShops.find(subShop => subShop.shopid === bill.shopid)
          )
        );
      });
    });
  }

  // 获取所有子商户指定日期的月账单
  monthlyBillsForSubShops(parentShopId, date) {
    return new Promise((resolve, reject) => {
      Promise.all([
        // 获取所有商户指定日期的账单,
        this.monthlyBillsByDate(date),
        // 获取所有一级子商户
        this.subShops(parentShopId)
      ]).then(([bills, subShops]) => {
        resolve(
          bills.filter(bill =>
            subShops.find(subShop => subShop.shopid === bill.shopid)
          )
        );
      });
    });
  }

  // 获取所有一级子商户
  subShops(parentShopId) {
    return new Promise((resolve, reject) => {
      // 获取所有商户信息
      this.shops().then(shops => {
        resolve(
          shops.filter(shop => {
            return shop.fshopid == parentShopId;
          }) || []
        );
      });
    });
  }

  // 获取所属商户的设备的日账单列表
  deviceBillsByShop(shopId, date) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/shopDeviceBill_ecard",
        method: "POST",
        data: {
          "shopid": shopId,
          "accdate": date
        },
        header: {
          'accessToken': keys.apis.token,
          'appId': keys.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      }).then(res => {
        resolve(res.data.dataSet || []);
      }).catch(err => reject(err))
    });
  }

  // 获取指定日期所有操作员的日账单
  operatorBillsByDate(date) {
    const key = `ecard:opeartion-bill:${date}`;
    return new Promise((resolve, reject) => {
      if (get(key)) return resolve(get(key));
      app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/operatorBill_ecard",
        method: "POST",
        data: { "accdate": date },
        header: {
          'accessToken': keys.apis.token,
          'appId': keys.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      }).then(res => {
        resolve(res.data.dataSet || []);
      }).catch(err => reject(err))
    });
  }

  // 指定日期的合并操作员账单
  mergedOperatorBillByDate(date) {
    return new Promise((resolve, reject) => {
      this.operatorBillsByDate(date).then(bills => {
        const bill = {
          date,
          inAmt: 0,
          outAmt: 0,
          transCnt: 0
        };
        bills.reduce((acc, cur) => {
          bill.inAmt += parseFloat(cur.inamt || 0);
          bill.outAmt += parseFloat(cur.outamt || 0);
          bill.transCnt += parseInt(cur.transcnt || 0);
          return bill;
        }, bill);
        resolve(bill);
      });
    });
  }

  //获取device信息
  async deviceCount() {
    const db = wx.cloud.database();
    const res = await db.collection('kvs').where({
      _id: "index:ecard-device-count"
    }).get();
    return res.data[0].value || 0;
  }

  //获取card信息
  async cardCount() {
    const db = wx.cloud.database();
    const res = await db.collection('kvs').where({
      _id: "index:ecard-card-count"
    }).get();
    return res.data[0].value || 0;
  }

  //搜索用户信息
  cardInfo(data) {
    return new Promise((resolve, reject) => {
      app.wxp.request({
        url: "https://apis.ynu.edu.cn/do/api/call/info_ecard",
        method: "POST",
        data:{
          "stuempno": data
        },
        header: {
          'accessToken': keys.apis.token,
          'appId': keys.apis.appId,
          'content-type': 'application/json' // 默认值
        },
      }).then(res => {
        if(res.data.dataSet.length === 0){
          app.wxp.request({
            url: "https://apis.ynu.edu.cn/do/api/call/info_ecard",
            method: "POST",
            data:{
              "custname": data
            },
            header: {
              'accessToken': keys.apis.token,
              'appId': keys.apis.appId,
              'content-type': 'application/json' // 默认值
            },
          }).then(res =>{resolve(res.data.dataSet || [])}).catch(err => {reject(err)})
        }else {
          resolve(res.data.dataSet || [])
        }
      }).catch(err => reject(err))
    });
  }
}

module.exports = EcardApi;