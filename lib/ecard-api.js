/**
 * version: 1.0.0
 * 一卡通系统API
 */

const {
  get,
  set
} = require('./storage.js');
class EcardApi {

  // 获取所有商户信息
  shops() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'ecardApiShopsInfo'
      }).then(res => {
        if (res.result.ret === 0) {
          resolve(res.result.data || []);
        } else reject(res.result);
      }).catch(err => reject(err));
    });
  }

  // 获取指定商户日账单列表
  dailyBills(shopId) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'ecardApiDailyBills',
        data: {
          shopId: shopId
        }
      }).then(res => {
        if (res.result.ret === 0) resolve(res.result.data || []);
        else reject(res.result);
      }).catch(err => reject(err));
    });
  }

  // 获取指定商户单日账单
  dailyBill(shopId, date) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'ecardApiDailyBill',
        data: {
          shopId: shopId,
          date: date
        }
      }).then(res => {
        if (res.result.ret === 0) resolve(res.result.data || []);
        else reject(res.result);
      }).catch(err => reject(err));
    });
  }

  // 获取指定日期所有商户的日账单
  dailyBillsByDate(date) {
    return this.dailyBill('all', date);
  }

  // 获取所有子商户指定日期的日账单
  dailyBillsForSubShops(parentShopId, date) {
    return new Promise((resolve, reject) => {
      Promise.all([
        // 获取所有商户指定日期的账单,
        this.dailyBillsByDate(date),
        // 获取所有一级子商户
        this.subShops(parentShopId),
      ]).then(([bills, subShops]) => {
        resolve(bills.filter(bill =>
          subShops.find(subShop =>
            subShop.shopId === bill.shopId
          )
        ));
      });
    });
  }

  // 获取所有一级子商户
  subShops(parentShopId) {
    return new Promise((resolve, reject) => {
      // 获取所有商户信息
      this.shops().then(shops => {
        resolve(shops.filter(({
          fShopId
        }) => {
          return fShopId === parentShopId;
        }) || []);
      });
    });
  }

  // 获取所属商户的设备的日账单列表
  deviceBillsByShop(shopId, date) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'ecardApiDeviceBillsByShop',
        data: {
          shopId: shopId,
          date: date
        }
      }).then(res => {
        if (res.result.ret === 0) resolve(res.result.data || []);
        else reject(res.result);
      }).catch(err => reject(err));
    });
  }

  // 获取指定日期所有操作员的日账单
  operatorBillsByDate(date) {
    const key = `ecard:opeartion-bill:${date}`;
    return new Promise((resolve, reject) => {
      if (get(key)) return resolve(get(key));
      wx.cloud.callFunction({
        name: 'ecardApiOperatorBillsByDate',
        data: {
          date: date
        }
      }).then(res => {
        if (res.result.ret === 0) resolve(res.result.data || []);
        else reject(res.result);
      }).catch(err => reject(err));
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
          transCnt: 0,
        };
        bills.reduce((acc, cur) => {
          bill.inAmt += parseFloat((cur.inAmt || 0));
          bill.outAmt += parseFloat((cur.outAmt || 0));
          bill.transCnt += parseInt((cur.transCnt || 0));
          return bill;
        }, bill);
        resolve(bill);
      });
    });

  }

  //获取device信息
  deviceCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'ecardApiDeviceCount',
      }).then((res) => {
        resolve(res.result.data[0].count_of_deviceid);
      }).catch(err => reject(err));
    });
  }

  //获取card信息
  cardCount() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'ecardApiCardCount',
      }).then((res) => {
        resolve(res.result.data[0].count_of_stuempno);
      }).catch(err => reject(err));
    });
  }
}

module.exports = EcardApi;