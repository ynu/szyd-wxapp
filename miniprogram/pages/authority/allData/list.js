// miniprogram/pages/authority/allData/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logs: [],
    inputShowed: false,
    inputVal: "",
    value: ""
  },
  async getDatas() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    const db = wx.cloud.database()
    //定义每次获取的条数
    const MAX_LIMIT = 20;
    //先取出集合的总数
    const countResult = await db.collection('user-permissions').count()
    const total = countResult.total
    //计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    // 承载所有读操作的 promise 的数组
    const arraypro = []
    //初次循环获取云端数据库的分次数的promise数组
    for (let i = 0; i < batchTimes; i++) {
      const promise = await db.collection('user-permissions').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      //二次循环根据获取的promise数组的数据长度获取全部数据push到arraypro数组中
      for (let j = 0; j < promise.data.length; j++) {
        arraypro.push(promise.data[j])
      }
    }
    //把数据传递至页面视图
    this.setData({
      logs: arraypro,
    });
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDatas();
    this.setData({
      search: this.search.bind(this)
    })
  },
  search: function (value) {
    let arr = [];
    return new Promise((resolve, reject) => {
      let rolesArr = this.data.logs.filter(role => {
        return role.name.indexOf(value) != -1;
      });
      if (value == "") {
        rolesArr = this.data.logs;
      }
      rolesArr.forEach(role => {
        arr.push({ text: role.name, value: role._id });
      });
      resolve(arr);
    })
  },
  selectResult: function (e) {
    wx.navigateTo({
      url: `/pages/authority/allData/list-detail?id=${e.detail.item.value}`,
    })
    console.log('select result', e.detail.item.value)
  },
  bindFocus: function (e) {    
    this.setData({
      value: ""
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})