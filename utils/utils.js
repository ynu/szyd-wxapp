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

const uirApi = new UirApi();
const weixinApi = new WeixinApi();
const ecardApi = new EcardApi();
const zqApi = new ZqApi();
const fcApi = new FcApi();
const risApi = new RisApi();

// 商户管理员角色前置，格式为：ecard:shop-manager:商户ID
const shopManagerRolePrefix = "ecard:shop-manager:";

const Roles = {
  FcSupervisor: "szyd:fc-supervisor", // 角色权限：进入fc/index
  EcardSupervisor: "szyd:ecard-supervisor", // 角色的权限：进入ecard/supervisor-index
  ZqSupervisor: 'szyd:zq-supervisor',
  RisSupervisor: 'szyd:ris-supervisor',
};

module.exports = {
  uirApi,
  weixinApi,
  ecardApi,
  zqApi,
  fcApi,
  risApi,
  Roles,
  shopManagerRolePrefix
};