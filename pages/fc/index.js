var config = require('../../config')

//获取虚拟机总数
function getAllMachineSum() {
  var offset = 0
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.service.getxj + offset,
      success: function (res) {
        let total = res.data.result.total
        resolve(total)
      }
    })
  })
}
//获取虚拟机列表
function getAllMachineList(offset) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.service.getxj + offset,
      success: function (res) {
        resolve(res)

      }
    })
  })
}

//按规则合并所以列表
function setdata(colony, host, vm) {
  for (var c in colony) {
    colony[c].host = []
    colony[c].vm = []
    colony[c].hoststatic = 0
    colony[c].vmstatic = 0
    for (var v in vm) {
      if (colony[c].name == vm[v].clusterName) {
        colony[c].vm.push(vm[v])
        if (vm[v].status == "running") {
          colony[c].vmstatic += 1
        }
      }

    }
    for (var h in host) {

      if (colony[c].name == host[h].clusterName) {
        colony[c].host.push(host[h])
        if (host[h].status == "running") {
          colony[c].hoststatic += 1
        }
      }
    }
  }

  return colony

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },


  onShow: function () {
    var vm = []
    var that = this
    var host = []

    getAllMachineSum().then(total => {
      for (let i = 0; i < total; i += 100) {
        vm.push(getAllMachineList(i))
      }

      Promise.all(vm).then(vm => {
        let AllData = vm.flatMap(x => {
          return x.data.result.list;
        })

        vm = AllData
        wx.request({
          url: config.service.getzj,
          success: function (res) {
            host = res.data.result.list
            wx.request({
              url: config.service.getjq,
              success: function (res) {
                that.setData({
                  datas: setdata(res.data.result, host, vm)
                })
              },
            })
          },
        })

      })
    })
  },
})