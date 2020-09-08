// miniprogram/pages/authority/allData/list-detail.js
import { Roles, meansApi, shopManagerRolePrefix, doorManagerRolePrefix } from '../../../utils/utils.js';
let roles = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: "",
    modules: [],
    roles: []
  },
  submitForm() {
    const that = this;
    const db = wx.cloud.database();
    db.collection('user-permissions')
      .doc(that.data._id)
      .update({
        data: {
          roles: this.data.roles
        }
      })
      .then(() => {
        wx.showModal({
          title: '提示',
          content: '修改权限成功',
          showCancel: false,
          confirmColor: '#007500'
        }).then(res => {
          wx.navigateBack({
            delta: 1
          })
        })
      })
  },
  switchChange(event) {
    //当开关为true时增加roles数组中的某项权限
    if (event.detail.value) {
      const arr = this.data.roles;
      arr.push(event.target.id);
      this.setData({
        roles: arr
      })
    } else {
      //当开关为false时删除roles数组中的某项权限
      const arr = this.data.roles;
      const index = arr.findIndex(item => item == event.target.id);
      arr.splice(index, 1);
      this.setData({
        roles: arr
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      _id: options.id
    });
    let obj = {};
    const that = this;
    //获取云端数据库判断当前用户拥有哪些模块的权限
    meansApi.getInfo('user-permissions', options.id).then(res => {
      let modules = [];
      res.data[0].module.forEach(role => {
        switch (role) {
          case Roles.RsSupervisor:
            modules.push({
              name: "人事",
              module: Roles.RsSupervisor
            });
            break;
          case Roles.FcSupervisor:
            modules.push({
              name: "虚拟化平台",
              module: Roles.FcSupervisor
            });
            break;
          case Roles.ZqSupervisor:
            modules.push({
              name: "站群系统",
              module: Roles.ZqSupervisor
            });
            break;
          case Roles.EcardSupervisor:
            modules.push({
              name: "一卡通",
              module: Roles.EcardSupervisor
            });
            break;
          case Roles.RisSupervisor:
            modules.push({
              name: "风控系统",
              module: Roles.RisSupervisor
            });
            break;
          case Roles.IpSupervisor:
            modules.push({
              name: "IP地址段查询",
              module: Roles.IpSupervisor
            });
            break;
          case Roles.DoorManager:
            modules.push({
              name: "数据中心门禁",
              module: Roles.DoorManager
            });
            break;
          case Roles.YjsSupervisor:
            modules.push({
              name: "研究生信息查询",
              module: Roles.YjsSupervisor
            });
            break;
          case Roles.BksSupervisor:
            modules.push({
              name: "本科生信息查询",
              module: Roles.BksSupervisor
            });
            break;
          case Roles.IdSystemSupervisor:
            modules.push({
              name: "统一身份认证系统",
              module: Roles.IdSystemSupervisor
            });
            break;
          case Roles.AuthorityManager:
            modules.push({
              name: "权限管理",
              module: Roles.AuthorityManager
            });
            break;
          default:
            if (role.indexOf(shopManagerRolePrefix) != -1) {
              modules.push({
                name: "一卡通"
              });
            } else if (role.indexOf(doorManagerRolePrefix) != -1) {
              modules.push({
                name: "数据中心门禁"
              });
            }
        }
      })
      //比较一个集合对象的module和roles，如果roles中已经存在module则，checked为true
      for (let i = 0; i < modules.length; i++) {
        if (res.data[0].roles.includes(modules[i].module)) {
          modules[i].checked = true;
        }
      }
      modules = modules.reduce((item, next) => {
        obj[next.name] ? '' : obj[next.name] = true && item.push(next);
        return item;
      }, []);
      that.setData({
        roles: res.data[0].roles,
        modules: modules
      });
      wx.hideLoading();
    })
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