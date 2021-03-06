Page({
  data: {inputValue:''},
  showImg: function (e) {
    var imgUrl = e.target.dataset.url;
    console.log(imgUrl);
    wx.previewImage({ urls: [imgUrl] })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '乐团新闻'
    })
    var newsdata = JSON.parse(options.newsdata)
    this.setData(newsdata)
  },
  send: function (e) {
    var that = this;
    var time = new Date;
    var now = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate();
    var info = e.detail.value;
    var id = this.data._id;
    var reply = {
      name: wx.getStorageSync('userInfo').nickName,
      time: now,
      content: info
    }
    var mydata = {}
    for (var item in this.data){
      mydata[item] = this.data[item]
    }
    mydata.reply.unshift(reply);
    delete mydata.__webviewId__
    // console.log(mydata)
    wx.request({//添加新闻数据
      url: 'https://www.nwsuaforchestra.cn/replyNews',
      data: mydata,
      method: 'POST',
      success: function (res) {
        if(res.data.success){
          wx.showToast({
            title: '回复成功',
          })
          mydata.inputValue = '';
          that.setData(mydata)
        }
      }
    })
  },
  checkload:function(){
    if (!wx.getStorageSync('isLoad')) {
      wx.showLoading({
        title: '未登录账号',
        complete: function () {
          setTimeout(function () {
            wx.switchTab({ url: '/pages/info/info' })
          }, 1000)
        }
      })
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})