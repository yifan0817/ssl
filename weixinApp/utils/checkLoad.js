var checkLoad = function (fromPage) {
  wx.request({
    url: 'https://www.nwsuaforchestra.cn/isLoad',
    data: {
      sessionid: wx.getStorageSync('sessionid')
    },
    method: 'GET',
    success: function (res) {
      if (!res.data.isLoad) {
        (getCurrentPages()[getCurrentPages().length - 1].__route__ != 'pages/info/info') && wx.showModal({
          title: '用户未登录',
          content: '请先登录账号',
          showCancel: false,
          success: function () {
            wx.switchTab({ url: '/pages/info/info' })
          }
        })
        wx.setStorageSync('isLoad', false)
        wx.setStorage({
          key: 'userInfo',
          data: {},
          complete: function (res) {
            if (fromPage) {
              wx.setStorageSync('sessionid', '');
              wx.setStorageSync('userInfo', {
                avatarUrl: 'https://www.nwsuaforchestra.cn/images/avatar.png',
                nickName: '请登录账号'
              });
              wx.setStorageSync('isLoad', false);
              fromPage.setData({ userInfo: wx.getStorageSync('userInfo') });
            }

          }
        })
      } else {
        //登录状态正常
        var userData = wx.getStorageSync('userInfo')
        fromPage && fromPage.setData({
          userInfo: {
            avatarUrl: userData.avatarUrl,
            nickName: userData.nickName
          }
        })
      }
    },
    fail: function (res) {
      console.log('服务器异常')
    }
  })
}

module.exports = {
  checkLoad: checkLoad
}