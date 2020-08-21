// pages/wg/index.js
import { zqApi } from '../../utils/utils.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    datas1: [],
    datas2: [],
    datas1GreenWebCount: 0
  },
  onLoad: function () {
    // wx.showLoading({
    //   title: '正在加载',
    //   mask: true
    // });
    let that = this;
    let datas1GreenWebCount = 0;
    zqApi.webFirm().then(data => {
      //循环判断每一个站点的状态，并做属性赋值
      for (let i = 0; i < data.length; i++) {        
        data[i].count = 0;
        if (data[i].wbstate == 0) {
          data[i].wbstate = "正在使用";
        } else {
          data[i].wbstate = "已停用";
        }
      }
      zqApi.webnewsCount().then(function (dataa) {
        //循环的增加站点的count属性，用来记录站点180天内更新的文章数量
        for (let j = 0; j < data.length; j++) {
          for (let a = 0; a < dataa.length; a++) {
            if (data[j].wbfirmid === dataa[a].owner) {
              data[j].count = dataa[a].count;
              datas1GreenWebCount++;
            }
          }
        }
        let {
          start,
          down
        } = zqApi.shutdownWeb(data);
        that.setData({
          datas1: start,
          datas2: down,
          datas1GreenWebCount
        });
        wx.hideLoading();
      }).catch(err => {
        wx.showModal({
          title: '提示',
          content: '系统异常，请联系管理员',
          showCancel: false
        });
        wx.hideLoading();
      }) ;
    });
  },
});