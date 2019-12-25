/*
一卡通系统角色设置
1. 商户管理员。
1.1 角色标识符：ecard:shop-manager:[shopId]
1.2 权限：查看指定商户及子商户和设备的日/月账单
*/

const UirApi = require("../lib/user-in-role.js");
const WeixinApi = require("../lib/weixin-api.js");
const EcardApi = require("../lib/ecard-api.js");
const ZqApi = require("../lib/zq-api.js");
const FcApi = require("../lib/fc-api.js");
const RisApi = require('../lib/ris-api.js');
const YjsApi = require('../lib/yjs-api.js');
const BksApi = require('../lib/bks-api.js');
const IdSystemApi = require('../lib/idSystem-api');

const uirApi = new UirApi();
const weixinApi = new WeixinApi();
const ecardApi = new EcardApi();
const zqApi = new ZqApi();
const fcApi = new FcApi();
const risApi = new RisApi();
const yjsApi = new YjsApi();
const bksApi = new BksApi();
const idSystemApi = new IdSystemApi();
// 商户管理员角色前置，格式为：ecard:shop-manager:商户ID
const shopManagerRolePrefix = "ecard:shop-manager:";

// 数据中心门禁管理员角色前置，格式为：door:door-manager:门ID
const doorManagerRolePrefix = "door:door-manager:";

const Roles = {
  FcSupervisor: "szyd:fc-supervisor", // 角色权限：进入fc/index
  EcardSupervisor: "szyd:ecard-supervisor", // 角色的权限：进入ecard/supervisor-index
  ZqSupervisor: 'szyd:zq-supervisor', // 角色权限，进入zq/index
  RisSupervisor: 'szyd:ris-supervisor', //角色权限，进入ris/index
  IpSupervisor: 'szyd:ip-supervisor', //角色权限，进入ip/index
  DoorManager: 'szyd:door-supervisor', //门的管理员权限，进入door/supervisor-index
  YjsSupervisor: 'szyd:yjs-supervisor', //研究生信息管理员权限，进入yjs/index
  BksSupervisor: 'szyd:bks-supervisor', //本科生生信息管理员权限，进入bks/index
  IdSystemSupervisor: 'szyd:IdSystem-supervisor',//统一身份认证系统管理员权限，进入idSystem/index
};

const meansApi = {
  getRoles() {
    const db = wx.cloud.database();
    //获取云端数据库判断当前用户拥有哪些模块的权限
    return db.collection('user-permissions').where({}).get()
  },
  getInfo(id) {
    const db = wx.cloud.database();
    //获取log的云端数据
    return db.collection('open-door-logs').where({
      _id: id
    }).get()
  }
}

//门的数组
const doors = [{
  name: "图书馆数据中心机房(靠大厅)",
  id: 1,
  isSupervisor: false
},
{
  name: "图书馆数据中心机房",
  id: 2,
  isSupervisor: false
},
{
  name: "图书馆准备间",
  id: 3,
  isSupervisor: false
},
{
  name: "图书馆UPS间",
  id: 4,
  isSupervisor: false
}
];

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
//用来对时间做格式化
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate()
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

module.exports = {
  uirApi,
  weixinApi,
  ecardApi,
  zqApi,
  fcApi,
  risApi,
  Roles,
  shopManagerRolePrefix,
  doorManagerRolePrefix,
  meansApi,
  doors,
  formatTime,
  yjsApi,
  bksApi,
  idSystemApi,
};