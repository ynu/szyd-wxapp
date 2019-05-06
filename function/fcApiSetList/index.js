// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  let setList;
  let vmHost;
  const hostor = 'http://fc-api.ynu.edu.cn/';
  const tokenor = process.env.tokenOne + '.' + process.env.tokenTwo + '.' + process.env.tokenThree;
  const siteIdor = process.env.siteId;

  function vms(options = {}) {
    let {
      siteId,
      limit,
      offset
    } = options;
    siteId = siteId || siteIdor;
    limit = limit || 20;
    offset = offset || 0;
    return new Promise((resolve, reject) => {
      let option = {
        uri: `${hostor}/site/${siteId}/vmResource/?limit=${limit}&offset=${offset}&token=${tokenor}`,
        json: true
      };
      resolve(request(option).then((res) => {
        return res.result;
      }))
    });
  }

  function vmCount() {
    return vms({
      limit: 1
    }).then(vms => vms.total);
  }

  // 获取所有虚拟机
  function allvm() {
    return vmCount().then(allvm => {
      let vm = [];
      let vmall = [];
      for (let offset = 0; offset < allvm; offset += 100) {
        vm.push(vms({
          siteId: siteIdor,
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

  function clusters(options = {}) {
    let {
      siteId
    } = options;
    siteId = siteId || siteIdor;
    return new Promise((resolve, reject) => {
      let options = {
        uri: `${hostor}/site/${siteId}/cluster?token=${tokenor}`,
        json: true
      };
      resolve(request(options).then((repos) => {
        return repos.result
      }))
    });
  }

  function hosts(options = {}) {
    let {
      siteId,
      limit,
      offset
    } = options;
    siteId = siteId || siteIdor;
    limit = limit || 20;
    offset = offset || 0;
    return new Promise((resolve, reject) => {
      let options = {
        uri: `${hostor}/site/${siteId}/hostResource/?limit=${limit}&offset=${offset}&token=${tokenor}`,
        json: true
      };
      resolve(request(options).then((repos) => {
        return repos.result
      }));
    });
  }

  function setlist() {
    return Promise.all([allvm(), clusters(), hosts()]).then(([allvm, clusters, hosts]) => {
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

  return {
    setList: await setlist().then((res) => res),
  }
}