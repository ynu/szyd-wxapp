/**
 * version: 1.0.0
 * 一卡通系统API
 */

const {
  get,
  set
} = require("./storage.js");

class EcardApi {
  // 获取所有商户信息
  shops() {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiShopsInfo"
        })
        .then(res => {
          resolve(res.result || []);
        })
        .catch(err => reject(err));
    });
  }

  //商户数量
  shopsCount() {
    const db = wx.cloud.database();
    return db.collection('kvs').where({
      _id: "index:ecard-shops-count"
    }).get().then((res) => {
      return res.data[0].value || 0;
    })
  }

  // 获取指定商户日账单列表
  dailyBills(shopId) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiDailyBills",
          data: {
            shopId: shopId
          }
        })
        .then(res => {
          resolve(res.result || []);
        })
        .catch(err => reject(err));
    });
  }

  // 获取指定商户单日账单
  dailyBill(queryObject) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiDailyBill",
          data: {
            queryObject
          }
        })
        .then(res => {
          resolve(JSON.parse(res.result) || []);
        })
        .catch(err => reject(err));
    });
  }

  // 获取指定商户月账单列表
  monthlyBills(shopId) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiMonthlyBills",
          data: {
            shopId: shopId
          }
        })
        .then(res => {
          resolve(res.result || []);
        })
        .catch(err => reject(err));
    });
  }

  // 获取指定商户单月账单
  monthlyBill(shopId, date) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiMonthlyBill",
          data: {
            shopId: shopId,
            date: date
          }
        })
        .then(res => {
          resolve(JSON.parse(res.result) || []);
        })
        .catch(err => reject(err));
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
    return this.monthlyBill("all", date);
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
            subShops.find(subShop => subShop.shopId === bill.shopId)
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
      wx.cloud
        .callFunction({
          name: "ecardApiDeviceBillsByShop",
          data: {
            shopId: shopId,
            date: date
          }
        })
        .then(res => {
          resolve(res.result || []);
        })
        .catch(err => reject(err));
    });
  }

  // 获取所属商户的设备的月账单列表
  deviceMonthlyBillsByShop(shopId, date) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiDeviceMonthlyBillsByShop",
          data: {
            shopId: shopId,
            date: date
          }
        })
        .then(res => {
          resolve([]);
        })
        .catch(err => reject(err));
    });
  }

  // 获取指定日期所有操作员的日账单
  operatorBillsByDate(date) {
    const key = `ecard:opeartion-bill:${date}`;
    return new Promise((resolve, reject) => {
      if (get(key)) return resolve(get(key));
      wx.cloud
        .callFunction({
          name: "ecardApiOperatorBillsByDate",
          data: {
            date: date
          }
        })
        .then(res => {
          resolve(res.result || []);
        })
        .catch(err => reject(err));
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
          bill.inAmt += parseFloat(cur.inAmt || 0);
          bill.outAmt += parseFloat(cur.outAmt || 0);
          bill.transCnt += parseInt(cur.transCnt || 0);
          return bill;
        }, bill);
        resolve(bill);
      });
    });
  }

  //获取device信息
  deviceCount() {
    const db = wx.cloud.database();
    return db.collection('kvs').where({
      _id: "index:ecard-device-count"
    }).get().then((res) => {
      return res.data[0].value || 0;
    })
  }

  //获取card信息
  cardCount() {
    const db = wx.cloud.database();
    return db.collection('kvs').where({
      _id: "index:ecard-card-count"
    }).get().then((res) => {
      return res.data[0].value || 0;
    })
  }

  //搜索用户信息
  cardInfoQuery(data) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiCardQuery",
          data: {
            data: data
          }
        })
        .then(res => {
          resolve(res.result);
        })
        .catch(err => reject(err));
    });
  }

  //获取制定用户的卡号信息
  cardInfo(data) {
    return new Promise((resolve, reject) => {
      wx.cloud
        .callFunction({
          name: "ecardApiCardInfo",
          data: {
            stuempno: data
          }
        })
        .then(res => {
          resolve(res.result);
        })
        .catch(err => reject(err));
    });
  }
}

module.exports = EcardApi;