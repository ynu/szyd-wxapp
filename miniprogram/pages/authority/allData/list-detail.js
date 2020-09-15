// miniprogram/pages/authority/allData/list-detail.js
import { doors, Roles, meansApi, shopManagerRolePrefix, doorManagerRolePrefix } from '../../../utils/utils.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: "",//一卡通权限的商户id
    _id: "",
    modules: [], //模块数组对象
    roles: [],  //授权的权限数组
    formData: {},
    isEcardSupervisor: false, //是否申请了一卡通权限，如果申请过了就会出现输入商户id的输入框
    isDoorSupervisor: false,//是否申请了门禁权限，如果申请过了就会出现门禁管理多选框
    doors: [],  //门禁的数组对象
    doorIdArr: [], //存储复选框选择门禁的id数组
    doorIdArrDatabase: [] //从数据库中选择出来的id数组
  },
  //当申请模块发生改变时触发此函数
  checkboxChange(e) {
    let arr = this.data.roles;    
    let [...arrCurrent] = arr; //深拷贝数组成为一个新的数组
    if (this.data.doorIdArrDatabase.length > e.detail.value.length) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].indexOf(doorManagerRolePrefix) != -1) {
          const index = arrCurrent.findIndex(item => item == arr[i]);
          arrCurrent.splice(index, 1);
        }
      }
    }
    this.setData({
      doorIdArr: e.detail.value,
      roles: arrCurrent
    });
  },
  //当商户id输入框发生变化时触发此函数
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },
  //点击提交时
  submitForm() {
    const that = this;
    const db = wx.cloud.database();
    let arr = that.data.roles;
    arr.push(`ecard:shop-manager:${that.data.formData.shopId}`);
    that.data.doorIdArr.forEach(id => {
      arr.push(`${doorManagerRolePrefix}${id}`)
    });
    this.setData({
      roles: [...new Set(arr)] //权限数组去重
    });
    db.collection('user-permissions')
      .doc(that.data._id)
      .update({
        data: {
          roles: this.data.roles
        }
      })
      .then((res) => {
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
      }).catch((err) => err)
  },
  //权限管理开关发生改变时触发此函数
  switchChange(event) {
    //当开关为true时增加roles数组中的某项权限
    if (event.detail.value) {
      let arr = this.data.roles;
      arr.push(event.target.id);
      this.setData({
        roles: arr
      })
    } else {
      //当开关为false时删除roles数组中的某项权限
      let arr = this.data.roles;
      const index = arr.findIndex(item => item == event.target.id);
      arr.splice(index, 1);
      let [...arrCurrent] = arr;//es6写法创建同一数组内容的不同存储地址不同名的数组
      // //如果关闭了数据中心门禁权限，则要删除role数组里面的所有:door-manager:项
      // if(event.target.id == "szyd:door-supervisor"){   
      //   for (let i = 0; i < arr.length; i++) {
      //     if (arr[i].indexOf(doorManagerRolePrefix) != -1) {
      //       const index = arrCurrent.findIndex(item => item == arr[i]);
      //       arrCurrent.splice(index, 1);
      //     }
      //   }
      // }
      this.setData({
        roles: arrCurrent
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    this.setData({
      _id: options.id
    });
    let obj = {};
    const that = this;
    //获取云端数据库判断当前用户拥有哪些模块的权限
    meansApi.getInfo('user-permissions', this.data._id).then(res => {
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
                name: "数据中心门禁（可查看日志权限）"
              });
            }
        }
      });
      //比较一个集合对象的module和roles，如果roles中已经存在module则，checked为true
      for (let i = 0; i < modules.length; i++) {
        if (res.data[0].roles.includes(modules[i].module)) {
          modules[i].checked = true;
        }
      }
      //筛选管理的权限
      let rolesArr = res.data[0].roles.filter(role => {
        return role.indexOf(doorManagerRolePrefix) != -1;
      });
      //筛选商户id
      let shopManager = res.data[0].roles.filter(role => {
        return role.indexOf(shopManagerRolePrefix) != -1;
      });
      //分离权限中的商户id
      let shopIdArr = shopManager.map(role => {
        return role.substring(19);
      });

      //分离权限中的门id
      let doorIdArr = rolesArr.map(role => {
        return role.substring(18);
      });
      doorIdArr.forEach(doorId => {
        switch (doorId) {
          case "1":
            doors[0].isSupervisor = true;
            break;
          case "2":
            doors[1].isSupervisor = true;
            break;
          case "3":
            doors[2].isSupervisor = true;
            break;
          case "4":
            doors[3].isSupervisor = true;
            break;
        }
      })
      modules = modules.reduce((item, next) => {
        obj[next.name] ? '' : obj[next.name] = true && item.push(next);
        return item;
      }, []);
      that.setData({
        doorIdArrDatabase: doorIdArr,
        shopId: shopIdArr[0],
        doors: doors,
        isEcardSupervisor: res.data[0].module.includes("szyd:ecard-supervisor"),
        isDoorSupervisor: res.data[0].module.includes("szyd:door-supervisor"),
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