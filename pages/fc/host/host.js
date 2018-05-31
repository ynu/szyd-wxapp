// pages/fc/host/host.js

//创建虚拟机数组分为启动的和没有启动的
function setvm(colony) {
  var vm = []
  var vmstart = []
  var host = colony.host
  vm.push(colony)
  vm.push("")
  return vm
}
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
    var that = this
    console.log(JSON.parse(options.host))
    that.setData({
      datas: JSON.parse(options.host)
    })
  },
  goToVm: function (event) {
    wx.navigateTo({
      url: `../vm/vm?colony=${JSON.stringify(setvm(event.currentTarget.dataset.vm))}`,
    })
  },


}) 