// pages/fa/index.js
const moduleList = ["请选择模块","虚拟化平台", "站群系统", "一卡通"]
const modules = ["请选择模块","虚拟化平台", "站群系统", "一卡通"];
var openId;
var length;
var id;
var datas
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modules,
    module:"请选择模块",
    openId,
    length,
    id,
    datas:[]
  },
  bindChange(e) {
    const val = e.detail.value
    this.setData({
      module:this.data.modules[val]
    })
  },
isPoneAvailable(arg) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    arg=parseInt(arg);
    if(!myreg.test(arg)) {
  return true;
} else {
  return false;
}
},
  submitAdd(e){
    const db = wx.cloud.database()
    let count=0;
    let conditions=true;
    const that=this;
    if (e.detail.value.name.replace(/^\s*|\s*$/g,"")=="")
    {
      conditions=false;
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
        showCancel: false,        
      })
    }
    else if(e.detail.value.unit.replace(/^\s*|\s*$/g, "") == ""){
      conditions=false;
      wx.showModal({
        title: '提示',
        content: '所在单位不能为空',
        showCancel: false,        
      })
    }
    
    else if (this.isPoneAvailable(e.detail.value.mobile)){
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '请正确填写手机号',
        showCancel: false,
      })     
    }
    else if (this.data.module=="请选择模块"){
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '请选择模块',
        showCancel: false,
      })    
    }
    if(conditions){
    for(let i=0;i<that.data.datas.length;i++)
    {     
      if(that.data.datas[i]==that.data.module)
      {
        count=1;
        break;
      }

    }
    if(count==1)
    {
      wx.showModal({
        title: '提示',
        content: '您已经申请过'+that.data.module+'请重新选择模块',
        showCancel:false,
        success(res) {
        }
      })

    }else{
    if(this.data.length==1){
      const _=db.command
     // const that=this
      db.collection('user-permissions').doc(that.data.id).update({
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
                url: '../index/index'
              })
            }
          })
        }
      })
    }
   
    else{
    db.collection('user-permissions').add({
      data:{
        name: e.detail.value.name,
        unit: e.detail.value.unit,
        mobile: e.detail.value.mobile,
        module:[this.data.module],
        roles:[]
      },
      success(res) {
        wx.showToast({
          title: '申请成功',
          icon: 'success',
          duration: 2000,
          success(res) {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        })
       
      },
      fail: console.error
    })
    }
    }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    console.info('call onLoad')
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        this.setData({openId: res.result.OPENID});
      }
    })
    const db = wx.cloud.database()
    db.collection('user-permissions').where({
      _openid: this.data.openId,
    })
      .get({
        success(res) {
          // res.data 是包含以上定义的两条记录的数组
          that.setData({
            length: res.data.length,
            id:res.data[0]._id
          })
        }
      })
    db.collection('user-permissions').doc(that.data.id).get().then(res => {
      // res.data 包含该记录的数据
      that.setData({
        datas:res.data.module
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