// pages/fa/index.js
const moduleList = ['请选择模块','虚拟化平台', '站群系统', '一卡通'];
const modules = ['请选择模块','虚拟化平台', '站群系统', '一卡通'];
let openId;
let length;
let id;
let datas;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    modules,//记录已经申请的模块
    module: '请选择模块',//记录当前选择的模块，默认值为'请选择模块'
    openId,//当前用户的openId
    length,//记录当前用户的云数据库记录数
    id,//记录当前用户在云数据库中的_id
    datas:[],
  },
  //当申请模块发生改变时触发此函数
  bindChange(e) {
    const val = e.detail.value;
    this.setData( {
      module: this.data.modules[val]
    })
  },
  //用来判断手机号码是否正确
  isPoneAvailable(arg) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    arg=parseInt(arg);
    if(!myreg.test(arg)) {
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
    if (e.detail.value.name.replace(/^\s*|\s*$/g,"") == "") {
      conditions = false;
      wx.showModal( {
        title: '提示',
        content: '姓名不能为空',
        showCancel: false,        
      })
      //检验所在单位是否为空
    } else if(e.detail.value.unit.replace(/^\s*|\s*$/g, "") == "") {
      conditions = false;
      wx.showModal( {
        title: '提示',
        content: '所在单位不能为空',
        showCancel: false,        
      })
      //检验手机号码填写是否正确
    } else if (that.isPoneAvailable(e.detail.value.mobile)) {
      conditions = false;
      wx.showModal( {
        title: '提示',
        content: '请正确填写手机号',
        showCancel: false,
      })
      //检验是否选择了模块   
    } else if (that.data.module == "请选择模块") {
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '请选择模块',
        showCancel: false,
      })    
    }
     //当conditions为true时，即所有内容都填完，执行下面代码
    if(conditions) {     
      for(let i = 0;i < that.data.datas.length;i++) {     
        if(that.data.datas[i] == that.data.module) {
          count = 1;
          break;
        }
      }
      //当前用户已经申请过了所提交的模块
      if(count == 1) {
        wx.showModal( {
          title: '提示',
          content: '您已经申请过' + that.data.module + '请重新选择模块',
          showCancel: false,
          success(res) {
          }
        })
      //用户没有申过选择的模块 
      } else {
        //用户不是第一次申请
        if(this.data.length == 1) {
          const _ = db.command;
          db.collection('user-permissions').doc(that.data.id).update( {
            data: {
              module: _.push(this.data.module)
            },
            success(res) {
              wx.showToast({
                title: '申请成功',
                icon: 'success',
                duration: 2000,
                success(res) {
                  wx.redirectTo({
                    url: '../index/index',
                  })
                }
              })
            }
          })
           //用户第一次申请
        } else {         
          db.collection('user-permissions').add({
            data: {
              name: e.detail.value.name,
              unit: e.detail.value.unit,
              mobile: e.detail.value.mobile,
              module: [this.data.module],
              roles: [],
            },
            success(res) {
              wx.showToast({
                title: '申请成功',
                icon: 'success',
                duration: 2000,
                success(res) {
                  wx.redirectTo({
                    url: '../index/index',//跳转的页面
                  })
                }
              })
            },
            fail: console.error,
          })
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    //调用云函数获取当前用户的openId
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        this.setData( {openId: res.result.OPENID} );
      }
    })
    const db = wx.cloud.database()
    //获取云数据库user-permissions集合中当前用户的记录
    db.collection('user-permissions').where({
      _openid: this.data.openId,
    })
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          that.setData({
            length: res.data.length,
            id: res.data[0]._id
          })
        }
      })
    db.collection('user-permissions').doc(that.data.id).get().then(res => {
      // res.data 包含该记录的数据
      that.setData({
        datas: res.data.module
      })
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