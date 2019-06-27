// pages/door/index.js

let {
  doors,
  formatTime,
  meansApi,
  doorManagerRolePrefix
} = require('../../utils/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    doors: [],
    info: {},
    doorIds: []
  },
  //点击开门按钮执行开门，往云端传开门的数据用作log，因为开门的流程都是一样的，所以就编写一个函数包裹起来。
  openDoor(name, id) {
    const db = wx.cloud.database();
    const date = Date();
    db.collection('open-door-logs')
      .add({
        data: {
          name,
          time: formatTime(new Date()),
          personName: this.data.info.name,
          unit: this.data.info.unit,
          mobile: this.data.info.mobile
        }
      })
      .then(() => {
        wx.cloud.callFunction({
          name: 'doorApiOpenDoor',
          data: {
            id: id
          }
        }).then(res => {
          if (res.result.code === 0) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: `${name}，开锁成功`,
              confirmColor: '#007500',
            })
            wx.hideLoading();
          } else {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: `${name}，开锁失败`,
              confirmColor: '#007500',
            })
          }
          wx.hideLoading();
          //resolve(res);
        }).catch(err => reject(err))
      })
  },

  //点击开门的函数
  click(e) {
    wx.showLoading({
      title: '正在开锁',
    })
    const db = wx.cloud.database();
    const name = e.currentTarget.dataset.name;
    const id = e.currentTarget.dataset.id;
    switch (name) {
      case "图书馆数据中心机房(靠大厅)":
        this.openDoor(name, id);
        break;
      case "图书馆数据中心机房":
        this.openDoor(name, id);
        break;
      case "图书馆准备间":
        this.openDoor(name, id);
        break;
      case "图书馆UPS间":
        this.openDoor(name, id);
        break;
    }
    this.setData({
      doors: doors
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let doorIds;
    let info = {};
    wx.showLoading({
      title: '正在加载',
    })
    meansApi.getRoles().then((res) => {
      info = res.data[0];
      this.setData({
        info: info
      });
    });
    // 定义方法：获取当前用户有权限的门ID列表
    const getShopIds = () => new Promise((resolve, reject) => {
      //获取云端数据库判断当前用户拥有哪些权限
      meansApi.getRoles().then(res => {
        //筛选管理的权限
        let rolesArr = res.data[0].roles.filter(role => {
          return role.indexOf(doorManagerRolePrefix) != -1;
        });
        //分离权限中的门id
        let shopsIdArr = rolesArr.map(role => {
          return role.substring(18);
        });
        resolve(shopsIdArr);
      })
    });
    Promise.all([
      getShopIds().catch(() => [])
    ]).then(([doorIds]) => {
      doorIds = doorIds;
      doorIds.forEach(doorId => {
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
      });
      this.setData({
        doors: doors
      });
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})