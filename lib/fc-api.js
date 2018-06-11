/**
 * version: 1.0.1
 * FC虚拟化平台API
 */

class FcApi {
  constructor(options) {
    this.host = options.host;
    this.token = options.token;
    this.siteId = options.siteId;
  }

  // 获取所有虚拟机
  allvm() {
    return this.vmCount().then(allvm => {
      let vm = [];
      let vmall = [];
      for (let offset = 0; offset < allvm; offset += 100) {
        vm.push(this.vms({ siteId: this.siteId, limit: 100, offset: offset }));
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
          if (cluster.name == host.clusterName){
            cluster.hostcount+=1;
          }
          for (let vm of allvm) {
            if (cluster.name == vm.clusterName){
              cluster.vmcount += 1;
              if (vm.status == "running"){
                cluster.vmstartcount+= 1;
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
    var downvm = [];
    for (let vm of vms) {
      if (vm.status == "stopped") {
        downvm.push(vm);
      }

    }
    return downvm;
  }

  vms(options = {}) {
    let { siteId, limit, offset } = options;
    siteId = siteId || this.siteId;
    limit = limit || 20;
    offset = offset || 0;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/site/${siteId}/vmResource/?limit=${limit}&offset=${offset}&token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });
  }

  vmCount() {
    return this.vms({ limit: 0 }).then(vms => {
      return vms.total;
    });
  }

  clusters(options = {}) {
    let { siteId } = options;
    siteId = siteId || this.siteId;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/site/${siteId}/cluster?token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });
  }

  hosts(options = {}) {
    let { siteId, limit, offset } = options;
    siteId = siteId || this.siteId;
    limit = limit || 20;
    offset = offset || 0;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/site/${siteId}/hostResource/?limit=${limit}&offset=${offset}&token=${this.token}`,
        success: function (res) {
          if (res.statusCode === 200 && res.data.errorCode === '00000000') resolve(res.data.result);
          else reject(res.data);
        },
        fail: function (res) {
          reject(res);
        },
      });
    });
  }

  hostCount() {
    return this.hosts({ limit: 0 }).then(hosts => {
      return hosts.total;
    });
  }
}

module.exports = FcApi;
