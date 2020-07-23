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
}, {
  name: '本科生信息查询',
  value: 'szyd:bks-supervisor',
  checked: false
}, {
  name: '统一身份认证系统',
  value: 'szyd:IdSystem-supervisor',
  checked: false
}, {
  name: '人事',
  value: 'szyd:rs-supervisor',
  checked: false
}
];
let checkBoxValue; //全局变量复选框值
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobileReceiveVcode: '', //用来存储发送验证码时填写的手机号
    isFirstApply: true, //记录是否为第一申请
    vcode: {
      btnClass: 'weui-vcode-btn',
      btnText: '获取',
      timer: 0,
    },
    modules: [], //记录模块数组
    permissions: [], //记录当前选择的模块对应的权限
    length: 0, //记录当前用户的云数据库记录数
    _id: '',
    sendCode: '',//记录生成的验证码
    dataGet: {
      name: '',
      unit: ''
    },
    formData: {}, //存储表单数据
    //rules检验规则
    rules: [{
      name: 'name',
      rules: { required: true, message: '姓名必填' },
    }, {
      name: 'unit',
      rules: { required: true, message: '所在单位必填' },
    }, {
      name: 'mobile',
      rules: [{ required: true, message: '手机号必填' }, { mobile: true, message: '手机号格式不对' }],
    }, {
      name: 'vcode',
      rules: { required: true, message: '验证码必填' },
    }, {
      name: 'checkbox',
      rules: { required: true, message: '多选列表是必选项' },
    }]
  },
  //将提示对话框提出，作为一个函数
  showModal(error) {
    wx.showModal({
      content: error.message,
      showCancel: false,
    })
  },
  //当输入框发生改变时触发此函数
  formInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },
  //点击提交按钮触发此函数
  submitForm() {
    const that = this;
    const db = wx.cloud.database();
    that.selectComponent('#form').validate((valid, errors) => {
      //当校验规则不通过时执行if条件为真，执行下面语句
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          that.showModal(errors[firstError[0]]);
          return false;
        }
      } else {
        //此处的if条件判断验证码与生成的验证码是否一致。
        if (that.data.formData.vcode !== that.data.sendCode) {
          wx.showModal({
            title: '提示',
            content: '请输入正确的验证码',
            showCancel: false
          })
          return false;
          //此处的if条件判断收到验证码的手机号与填写的手机号是否一致
        } else if (that.data.formData.mobile !== that.data.mobileReceiveVcode) {
          wx.showModal({
            title: '提示',
            content: '输入的手机号并非是收到验证码的手机号',
            showCancel: false
          })
          return false;
        }
        //如果验证码输入正确执行下面语句
        else {
          //判断是否为第一次提交，如果不是执行if条件为真
          if (that.data.length === 1) {
            const _ = db.command;
            db.collection('user-permissions')
              .doc(that.data._id)
              .update({
                data: {
                  name: that.data.formData.name,
                  unit: that.data.formData.unit,
                  mobile: that.data.formData.mobile,
                  module: that.data.permissions.concat(checkBoxValue),
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
                  name: that.data.formData.name,
                  unit: that.data.formData.unit,
                  mobile: that.data.formData.mobile,
                  module: that.data.permissions.concat(checkBoxValue),
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
      }
    });
  },
  mobileInput(e) {
    this.setData({
      mobile: e.detail.value,
      sendCode: '', // 手机号码一旦变化，之前发送的验证码就失效。
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
  btnSendVcode(e) {
    // 如果已经有计时器在运行，则退出
    if (this.data.vcode.timer) return;
    // 验证电话号码是否正确
    const {
      mobile
    } = this.data.formData;
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
      mobileReceiveVcode: mobile
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
    checkBoxValue = e.detail.value.filter(s => s != '');
    if (e.detail.value.length === 0) {
      this.setData({
        [`formData.checkbox`]: null
      });
    } else {
      this.setData({
        [`formData.checkbox`]: e.detail.value
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
        for (const key in res.data[0].module) {
          modules = modules.reduce((total, current) => {
            current.value !== res.data[0].module[key] && total.push(current);
            return total;
          }, []);
        }
        that.setData({
          [`formData.name`]: res.data[0].name, //初始化校验数据name
          [`formData.unit`]: res.data[0].unit, //初始化校验数据unit
          [`formData.mobile`]: res.data[0].mobile, //初始化校验数据mobile
          permissions: res.data[0].module || [],
          dataGet: res.data[0],
          mobile: res.data[0].mobile,
          modules: modules,
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
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
});