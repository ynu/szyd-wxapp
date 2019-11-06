// pages/wg/index.js
const {
  ecardApi,
  zqApi,
  fcApi,
  uirApi,
  weixinApi,
  appId,
  Roles,
} = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas1: [],
    datas2: []
  },
  onLoad: function() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    var that = this;
    zqApi.webFirm().then(function(data) {
      //循环判断每一个站点的状态，并做属性赋值
      for (var i = 0; i < data.length; i++) {
        if (data[i].wbstate == 0) {
          data[i].wbstate = "正在使用";
        } else {
          data[i].wbstate = "已停用";
        }
      }
      zqApi.webnewsCount().then(function(dataa) {
        //循环的增加站点的count属性，用来记录站点180天内更新的文章数量
        for (var j = 0; j < data.length; j++) {
          data[j].count = 0;
          for (var a = 0; a < dataa.length; a++) {
            if (data[j].wbfirmid === dataa[a].owner) {
              data[j].count = dataa[a].count;
            }
          }
        }
        let {
          start,
          down
        } = zqApi.shutdownWeb(data);
        that.setData({
          datas1: start,
          datas2: down
        });
        wx.hideLoading();
      });
    });
  },
});