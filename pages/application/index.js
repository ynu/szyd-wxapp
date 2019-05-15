// pages/fa/index.js
let modules = [{ name: "虚拟化平台", value: "szyd:fc-supervisor", checked: false}, { name: "站群系统", value: "szyd:zq-supervisor", checked: false }, { name: "一卡通", value: "szyd:ecard-supervisor", checked: false}];
let permissions;
let openId;
let length;
let datas;
let _id;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modules:[],
    permissions: [],//记录当前选择的模块对应的权限
    //module: "请选择模块", //记录当前选择的模块，默认值为'请选择模块'
    openId, //当前用户的openId
    length, //记录当前用户的云数据库记录数
    _id,
    datas: [] //记录已经申请的模块
  },
  //当申请模块发生改变时触发此函数
  checkboxChange(e) {
    console.log("**********",e.detail.value)
    const val = e.detail.value;
    this.setData({
      permissions: val,
      //module: val
    });
  },
  //用来判断手机号码是否正确
  isPoneAvailable(arg) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    arg = parseInt(arg);
    if (!myreg.test(arg)) {
      return true;
    } else {
      return false;
    }
  },
  //点击提交按钮触发此函数提交，并检验
  submitAdd(e) {
    const db = wx.cloud.database();
    let count = 0;
    let conditions = true; //conditions用来记录所需填写的内容是否全部满足
    const that = this;
    //检验姓名是否为空
    if (e.detail.value.name.replace(/^\s*|\s*$/g, "") == "") {
      conditions = false;
      wx.showModal({
        title: "提示",
        content: "姓名不能为空",
        showCancel: false
      });
      //检验所在单位是否为空
    } else if (e.detail.value.unit.replace(/^\s*|\s*$/g, "") == "") {
      conditions = false;
      wx.showModal({
        title: "提示",
        content: "所在单位不能为空",
        showCancel: false
      });
      //检验手机号码填写是否正确
    } else if (that.isPoneAvailable(e.detail.value.mobile)) {
      conditions = false;
      wx.showModal({
        title: "提示",
        content: "请正确填写手机号",
        showCancel: false
      });
      //检验是否选择了模块
    } else if (that.data.permissions.length === 0) {
      conditions = false;
      wx.showModal({
        title: "提示",
        content: "请选择模块",
        showCancel: false
      });
    }
    //当conditions为true时，即所有内容都填完，执行下面代码
    if (conditions) {
        //用户不是第一次申请
        if (that.data.length == 1) {
          const _ = db.command;
          db.collection("user-permissions")
            .doc(that.setData._id)
            .update({
              data: {
                module: _.push.apply(that.data.datas,that.data.permissions)
              }
            })
            .then(() => {
              wx.showToast({
                title: "申请成功",
                icon: "success",
                duration: 2000,
                success(res) {
                  wx.redirectTo({
                    url: "../index/index"
                  });
                }
              });
            });
          //用户第一次申请
        } else {
          db.collection("user-permissions")
            .add({
              data: {
                name: e.detail.value.name,
                unit: e.detail.value.unit,
                mobile: e.detail.value.mobile,
                module: that.data.permissions,
                roles: []
              }
            })
            .then(() => {
              wx.showToast({
                title: "申请成功",
                icon: "success",
                duration: 2000,
                success(res) {
                  wx.redirectTo({
                    url: "../index/index" //跳转的页面
                  });
                }
              });
            });
        }
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    //调用云函数获取当前用户的openId
    wx.cloud.callFunction({
      name: "getOpenId",
      complete: res => {
        this.setData({
          openId: res.result.OPENID
        });
      }
    });
    const db = wx.cloud.database();
    //获取云数据库user-permissions集合中当前用户的记录
    db.collection("user-permissions")
      .where({
        _openid: this.data.openId
      })
      .get()
      .then(res => {
        console.log(res);
        that.setData({
          length: res.data.length,
          modules: modules
        });
        if (res.data.length != 0) {
          console.log("+++++++++++++******",res.data)
          for(let i = 0; i < res.data[0].module.length; i++){
            for(let j = 0; j < modules.length; j++){
              if(res.data[0].module[i] == modules[j].value){
                modules[j].checked = true;
                modules[j].disabled = true;
              }            
            }
          }
          that.setData({
            modules: modules,
            datas: res.data[0].module,
            _id: res.data[0]._id
          });
        }
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});