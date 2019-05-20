/**
 * version: 1.0.2
 * FC虚拟化平台API
 */

class FcApi {
  // 获取所有虚拟机
  allvm() {
    return this.vmCount().then(allvm => {
      let vm = [];
      let vmall = [];
      for (let offset = 0; offset < allvm; offset += 100) {
        vm.push(this.vms({
          siteId: this.siteId,
          limit: 100,
          offset: offset
        }));
      }
      return Promise.all(vm).then(vms => {
        for (let vm of vms) {
          vmall = vmall.concat(vm.list);
        }
        return vmall;
      });
    });
  }
  // 查询指定集群虚拟机
  SelectVmForClusters(clusterName) {
    return this.allvm().then(vms => {
      var newvms = [];
      for (let vm of vms) {
        if (vm.clusterName == clusterName) {
          newvms.push(vm);
        }
      }
      return newvms;
    });

  }

  // 查询指定主机虚拟机
  SelectVmForHost(hostName) {
    return this.allvm().then(vms => {
      var newvms = [];
      for (let vm of vms) {
        if (vm.hostName == hostName) {
          newvms.push(vm);
        }
      }
      return newvms;
    });
  }

  // 查询指定集群主机
  SelectHostForClusters(clusterName) {
    return this.hosts().then(hosts => {
      var newhost = [];
      for (let host of hosts.list) {
        if (host.clusterName == clusterName) {
          newhost.push(host);
        }
      }
      return newhost;
    });

  }

  // 按规则合并集群主机虚拟机
  setlist() {
    return Promise.all([this.allvm(), this.clusters(), this.hosts()]).then(([allvm, clusters, hosts]) => {
      for (let cluster of clusters) {
        cluster.hostcount = 0;
        for (let host of hosts.list) {
          cluster.vmcount = 0;
          cluster.vmstartcount = 0;
          if (cluster.name == host.clusterName) {
            cluster.hostcount += 1;
          }
          for (let vm of allvm) {
            if (cluster.name == vm.clusterName) {
              cluster.vmcount += 1;
              if (vm.status == "running") {
                cluster.vmstartcount += 1;
              }
            }
          }
        }
      }
      return clusters;
    });
  }

  // 筛选关闭的虚拟机
  ShutdownVm(vms) {
    var down = [];
    var start = [];
    for (let vm of vms) {
      if (vm.status == "stopped") {
        down.push(vm);
      } else {
        start.push(vm);
      }
    }
    return {
      start,
      down
    };
  }

//通过云函数获取指定的虚拟机信息
  vms(options = {}) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'fcApiVms',
        data: {
          siteIdOptions: options.siteId,
          limit: options.limit,
          offset: options.offset
        }
      }).then(res => {
        resolve(res.result.result);
      }).catch(err => reject(err))
    })
  }
 //获取虚拟机总数量
  vmCount() {
    return this.vms({
      limit: 1
    }).then(vms => vms.total);
  }

 //通过云函数获取集群
  clusters(options = {}) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'fcApiClusters',
        data: {
          siteIdOption: options.siteId
        }
      }).then(res => {
        resolve(res.result.result);
      }).catch(err => reject(err))
    })
  }

//通过云函数获取主机信息
  hosts(options = {}) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'fcApiHosts',
        data: {
          siteIdOption: options.siteId,
          limit: options.limit,
          offset: options.offset
        }
      }).then(res => {
        resolve(res.result.result)
      }).catch(err => reject(err))
    })
  }

//获取主机数量
  hostCount() {
    return this.hosts({
      limit: 1
    }).then(hosts => hosts.total);
  }

  //计算正在运行的虚拟机的数量
  runningVmCount() {
    return new Promise((resolve, reject) => {
      this.allvm().then(res => {
        let count = 0; //用来记录正在使用的虚拟机数
        for (let vm of res) {
          if (vm.status === "running") {
            count++;
          }
        }
        resolve(count);
      }).catch(err => {
        reject(err);
      });
    })
  }
}

module.exports = FcApi;