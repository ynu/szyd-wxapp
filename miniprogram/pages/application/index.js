// pages/fa/index.js
import { meansApi } from '../../utils/utils.js';
let modules = [{
  name: '虚拟化平台',
  value: 'szyd:fc-supervisor',
  checked: false
}, {
  name: '站群系统',
  value: 'szyd:zq-supervisor',
  checked: false
}, {
  name: '一卡通',
  value: 'szyd:ecard-supervisor',
  checked: false
}, {
  name: '风控系统',
  value: 'szyd:ris-supervisor',
  checked: false
}, {
  name: 'IP地址段查询',
  value: 'szyd:ip-supervisor',
  checked: false
}, {
  name: '数据中心门禁',
    value: 'szyd:door-supervisor',
  checked: false
  }, {
    name: '研究生信息查询',
    value: 'szyd:yjs-supervisor',
    checked: false
  },{
    name: '本科生信息查询',
    value: 'szyd:bks-supervisor',
    checked: false
  },{
    name: '统一身份认证系统',
    value: 'szyd:IdSystem-supervisor',
    checked: false
  },{
    name: '人事',
    value: 'szyd:rs-supervisor',
    checked: false
  }
];
let permissions;
let length;
let datas;
let _id;
let mobile;
let sendCode;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isFirstApply: true, //记录是否为第一申请
    mobile,
    vcode: {
      btnClass: 'weui-vcode-btn',
      btnText: '获取',
      timer: 0,
    },
    modules: [],
    permissions: [], //记录当前选择的模块对应的权限
    //module: '请选择模块', //记录当前选择的模块，默认值为'请选择模块'
    length, //记录当前用户的云数据库记录数
    _id,
    datas: [], //记录已经申请的模块
    sendCode: '',
    dataGet: {
      name: '',
      unit: ''
    }
  },
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value,
      sendCode: '', // 手机号码一旦变化，之前发送的验证码就失效。
    });
  },
  btnSendVcode(e) {
    // 如果已经有计时器在运行，则退出
    if (this.data.vcode.timer) return;
    // 验证电话号码是否正确
    const {
      mobile
    } = this.data;
    if (this.isPoneAvailable(mobile)) {
      wx.showModal({
        title: '手机号码错误',
        content: '请填写正确的手机号码',
        showCancel: false,
      });
      return;
    }
    // 生成验证码
    const code = [0, 0, 0, 0].reduce((acc, cur) => {
      return acc + Math.floor(Math.random() * 10);
    }, '');
    // 保存验证码
    this.setData({
      sendCode: code,
    });
    // 发送验证码
    wx.cloud.callFunction({
        name: 'qcSmsSendSingle',
        data: {
          mobile: this.data.mobile,
          code: this.data.sendCode
        }
      })
      .then(result => {
        // 发送成功
        wx.showToast({
          title: '发送成功',
        });
      }).catch(err => {
        // 发送失败，可能原因是手机号码不对
        wx.showModal({
          title: '提示',
          content: '发送失败',
          showCancel: false
        });
        this.setData({
          vcode: {
            timer: 0,
          },
        });
      });
    // 设置倒计时
    const countDown = timer => {
      const setVcodeView = () => {
        if (timer) {
          this.setData({
            vcode: {
              timer,
              btnText: `重新获取(${timer})`,
              btnClass: 'weui-vcode-btn-disabled',
            }
          });
        } else {
          this.setData({
            vcode: {
              timer,
              btnText: `重新获取`,
              btnClass: 'weui-vcode-btn',
            }
          });
        }
      };
      setVcodeView();
      setTimeout(() => {
        setVcodeView();
        if (timer) countDown(timer - 1);
      }, 1000);
    }
    countDown(60);
  },
  //当申请模块发生改变时触发此函数
  checkboxChange(e) {
    let val = e.detail.value;
    val = val.filter(s => s != '');
    this.setData({
      permissions: val,
    });
  },
  //用来判断手机号码是否正确
  isPoneAvailable(arg) {
    let myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
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
    //如果是第一次申请就需要判断姓名，所属单位是否为空
    //if (that.data.isFirstApply) {
    //检验姓名是否为空
    if (e.detail.value.name.replace(/^\s*|\s*$/g, '') === '') {
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
        showCancel: false
      });
      //检验所在单位是否为空
    } else if (e.detail.value.unit.replace(/^\s*|\s*$/g, '') === '') {
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '所在单位不能为空',
        showCancel: false
      });
    }
    // }
    //检验手机号码填写是否正确
    else if (that.isPoneAvailable(e.detail.value.mobile)) {
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '请正确填写手机号',
        showCancel: false
      });
      //检验是否填入了正确的验证码
    } else if (e.detail.value.vcode != that.data.sendCode || that.data.sendCode === '') {
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '请输入正确的验证码',
        showCancel: false
      })
      //检验是否选择了模块
    } else if (that.data.permissions.length === 0) {
      conditions = false;
      wx.showModal({
        title: '提示',
        content: '请选择模块',
        showCancel: false
      });
    }
    //当conditions为true时，即所有内容都填完，执行下面代码
    if (conditions) {
      //用户不是第一次申请
      if (that.data.length === 1) {
        const _ = db.command;
        db.collection('user-permissions')
          .doc(that.data._id)
          .update({
            data: {
              name: e.detail.value.name,
              unit: e.detail.value.unit,
              mobile: e.detail.value.mobile,
              module: that.data.permissions
            }
          })
          .then(() => {
            wx.showModal({
              title: '提示',
              content: '您的申请已成功提交，请耐心等候审批',
              showCancel: false,
              confirmColor: '#007500',
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          });
        //用户第一次申请
      } else {
        db.collection('user-permissions')
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
            wx.showModal({
              title: '提示',
              content: '您的申请已成功提交，请耐心等候审批',
              showCancel: false,
              confirmColor: '#007500',
              success(res) {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          });
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const db = wx.cloud.database();
    const that = this;
    wx.showLoading({
      title: '正在加载',
      mask: true
    });
    //获取云数据库user-permissions集合中当前用户的记录
    meansApi.getRoles().then(res => {
      that.setData({
        length: res.data.length,
        modules: modules
      });
      if (res.data.length != 0) {
        for (let i = 0; i < res.data[0].roles.length; i++) {
          for (let j = 0; j < modules.length; j++) {
            if (res.data[0].roles[i] === modules[j].value) {
              modules[j].disabled = true;
            }
          }
        }
        for (let i = 0; i < res.data[0].module.length; i++) {
          for (let j = 0; j < modules.length; j++) {
            if (res.data[0].module[i] === modules[j].value) {
              modules[j].checked = true;
            }
          }
        }
        that.setData({
          dataGet: res.data[0],
          mobile: res.data[0].mobile,
          modules: modules,
          datas: res.data[0].module,
          isFirstApply: false,
          _id: res.data[0]._id
        });
      }
      wx.hideLoading();
    });;
  },

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