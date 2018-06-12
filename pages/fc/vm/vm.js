const {
  ecardApi, zqApi, fcApi, uirApi, weixinApi, appId, Roles,
} = require('../../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that =this;
    Promise.all([fcApi.SelectVmForClusters(options.colony)]).then(vm=>{
      Promise.all([fcApi.ShutdownVm(vm[0])]).then(vm=>{
        this.setData({
          datas1:vm[0].start,
          datas2:vm[0].down
        })
      })
    })


  },
  
});