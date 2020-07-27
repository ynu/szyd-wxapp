// pages/ecard/query/index.js
import { ecardApi } from '../../../utils/utils.js';
const app = getApp();

Page({
  data: {
    inputShowed: true,
    inputVal: "",
    resultCount: 0,
    result: []
  },
  searchInput: function() {
    app.wxp.showLoading({
      title: "正在加载",
      mask: true
    });
    //模糊查询，从对象的name模糊查询得出结果
    Promise.all([
      ecardApi.cardInfoQuery(this.data.inputVal).catch(() => [])
    ]).then(
      ([result]) => {
        app.wxp.hideLoading();
        if (result.length === 0) {
          app.wxp.showModal({
            title: '提示',
            content: '查询结果为空',
            showCancel: false
          });
        } else {
          this.setData({
            resultCount: result.length,
            result: result
          })
        }
      }).catch(error => {
      app.wxp.hideLoading();
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: "",
      result: [],
      resultCount: 0
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value,
      result: [],
      resultCount: 0
    });
  }
});