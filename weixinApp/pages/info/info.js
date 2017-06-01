// pages/info/info.js
var checkLoad = require('../../utils/checkLoad').checkLoad;
Page({
  data: {
    userInfo: {
      avatarUrl: 'https://www.nwsuaforchestra.cn/images/avatar.png',
      nickName: '请登录账号'
    },
    showpasswd: true,
    eyesrc: 'https://www.nwsuaforchestra.cn/images/closeeye.png',
    showLoginBox: 'none',
    passwdfocus: false,
    share_url:'',
    showShare:'none'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
  },
  wxLogin: function () {
    var that = this;
    wx.showModal({
      title: '登录确认',
      content: '您确定要使用当前登陆的微信账号来登录西农交响微信小程序吗~~',
      success: function (res) {
        // console.log(res)
        if (res.confirm) {
          if (wx.getStorageSync('isLoad')) {
            wx.showToast({
              title: '您已登录'
            })
            return;
          }
          that.getUserInfo();
        } else {
          console.log('暂时不登录')
        }
      }
    })
  },
  getUserInfo: function () {
    var that = this
    //调用登录接口
    //参考文档 http://www.jianshu.com/p/c5f6c98b2685
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log('获取用户登录凭证：' + code);

        wx.request({
          url: 'https://www.nwsuaforchestra.cn/wxLogin',
          data: { code: code },
          method: 'POST',
          success: function (res) {
            //console.log(res.data.sessionid);
            wx.setStorageSync('sessionid', res.data.sessionid)
            wx.getUserInfo({
              success: function (res) {
                wx.setStorageSync('userInfo', res.userInfo)
                wx.setStorageSync('isLoad', 'load')
                that.setData({
                  userInfo: wx.getStorageSync('userInfo')
                })
              }
            })
            wx.showToast({
              title: '登录成功'
            })
          },
          fail: function (res) {

          }
        })
      }
    })
  },
  showpasswd: function () {
    if (this.data.showpasswd) {
      this.setData({
        showpasswd: false,
        eyesrc: 'https://www.nwsuaforchestra.cn/images/openeye.png',
        passwdfocus: true
      })
    } else {
      this.setData({
        showpasswd: true,
        eyesrc: 'https://www.nwsuaforchestra.cn/images/closeeye.png',
        passwdfocus: true
      })
    }
  },
  myLogin: function () {
    if (wx.getStorageSync('isLoad') === 'load') {
      wx.showModal({
        title: '已登录',
        content: '您已经登录，如需重新登录请先退出当前账号~~'
      })
      return;
    }
    this.setData({
      showLoginBox: 'block'
    })
  },
  loginSubmit: function (e) {
    var account = e.detail.value.account,
      passwd = e.detail.value.passwd,
      that = this;
    account = account.trim()
    passwd = passwd.trim()
    if (account.length === 0 || passwd.length === 0) {
      wx.showModal({
        title: '用户名或密码不能为空'
      })
      return;
    }
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/myLogin',
      data: {
        account: account,
        passwd: passwd
      },
      method: 'POST',
      success: function (res) {
        if (res.data.success) {
          wx.showToast({
            title: '登录成功'
          })
          that.closeLoginBox();
          var userInfo = res.data.userData[0];
          // console.log(userInfo)
          wx.setStorageSync('sessionid', res.data.sessionid)
          wx.setStorageSync('userInfo', {
            nickName: userInfo.username,
            avatarUrl: userInfo.avatarUrl,
            email: userInfo.email,
            sex: userInfo.sex,
            date: userInfo.date
          })
          wx.setStorageSync('isLoad', 'load')
          that.setData({
            userInfo: wx.getStorageSync('userInfo')
          })

        } else {
          wx.showModal({
            title: '登录失败',
            content: '用户名或密码错误'
          })
        }
      },
      fail: function (res) {
        console.log('服务器错误');
      },
      complete: function (res) {
        // complete
      }
    })
  },
  closeLoginBox: function () {
    this.setData({
      showLoginBox: 'none'
    })
  },
  sign: function () {
    wx.navigateTo({ url: '/pages/info/sign' })
  },
  signout: function () {
    var that = this;
    if (!wx.getStorageSync('sessionid')) {
      wx.showModal({
        title: '未登录账号',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      title: '退出登录',
      content: '您确定要退出当前账号？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在退出',
            mask: true
          })
          wx.request({
            url: 'https://www.nwsuaforchestra.cn/signout',
            data: {
              sessionid: wx.getStorageSync('sessionid')
            },
            method: 'POST',
            success: function (res) {
              if (res.data.success) {
                wx.showToast({
                  title: '退出成功'
                })
                wx.setStorageSync('sessionid', '')
                wx.setStorageSync('userInfo', {
                  avatarUrl: 'https://www.nwsuaforchestra.cn/images/avatar.png',
                  nickName: '请登录账号'
                })
                wx.setStorageSync('isLoad', false)
                that.setData({ userInfo: wx.getStorageSync('userInfo') })
              } else {
                wx.showToast({
                  title: '退出失败',
                  icon: 'loading'
                })
              }
            },
            fail: function (res) {
              console.log('服务器错误');
            },
            complete: function (res) {
              // complete
            }
          })
        }
      }
    })
  },
  personalInfo: function () {//个人资料
    if (!wx.getStorageSync('sessionid')) {
      wx.showModal({
        title: '未登录账号',
        showCancel: false
      })
      return;
    }
    wx.navigateTo({ url: 'personalInfo' })
  },
  shareMP:function(){
    var that = this;
    that.setData({
      showShare:'block'
    })
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/shareMP',
      method: 'POST',
      data:{
        appid:'wx0e7ed09c5e600c92',
        secret:'1a58030d9a08c0b782546150dde05fe2'
      },
      success: function(res){
        if(res.data.success){
          that.setData({
            share_url:res.data.picurl
          })
          // console.log(res.data.picurl)
        }else{
           console.log('服务器错误')
        }
      },
      fail: function(res) {
        console.log('服务器错误')
      }
    })
  },
  closeShare:function(){
    this.setData({
      showShare:'none'
    })
  },
  appinfo:function(){
    wx.navigateTo({url: '/pages/info/appinfo'})
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    checkLoad(this);//检查登录
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})