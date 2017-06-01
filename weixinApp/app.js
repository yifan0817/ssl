//app.js
var checkLoad = require('./utils/checkLoad').checkLoad;
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    appName: '西农交响小程序'
  },
  onHide: function () {
    wx.closeSocket();
  },
  onShow: function () {
    var that = this;
    setInterval(function () {//ajax轮询，每分钟检测一次登录状态
      console.log('小程序启动，或从后台进入前台显示')
      if (!wx.getStorageSync('sessionid')) {
        return;
      } else {
        that.checkLoadStat()
      }
    }, 60000)
  },
  checkLoadStat: function () {
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/isLoad',
      data: {
        sessionid: wx.getStorageSync('sessionid')
      },
      method: 'GET',
      success: function (res) {
        if (!res.data.isLoad) {
          console.log('未登录，清空Storage')
          wx.setStorageSync('isLoad', false)
          wx.setStorageSync('sessionid', '');
          wx.setStorageSync('userInfo', {
            avatarUrl: 'https://www.nwsuaforchestra.cn/images/avatar.png',
            nickName: '请登录账号'
          });
        }
      },
      fail: function (res) {
        console.log('服务器异常')
      }
    })
  }
})