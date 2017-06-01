//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    swiper_imgs: ['https://www.nwsuaforchestra.cn/images/p1.jpg',
      'https://www.nwsuaforchestra.cn/images/p3.jpg', 'https://www.nwsuaforchestra.cn/images/p5.jpg',
      'https://www.nwsuaforchestra.cn/images/p4.jpg'
    ],
    newsList: [],
    topicsList: [],
    animationData: {},
    animationDir:1
  },
  introduction: function () {
    wx.navigateTo({
      url: 'introduction/introduction'
    })
  },
  history: function () {
    wx.navigateTo({
      url: 'history/history'
    })
  },
  message: function () {
    wx.navigateTo({
      url: 'message/message'
    })
  },
  members: function () {
    wx.navigateTo({
      url: 'members/members'
    })
  },
  swiper_more: function () {
    wx.navigateTo({
      url: 'pictures/pictures'
    })
  },
  showVideo:function(){
    wx.navigateTo({
      url: 'video/video'
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  phone: function () {
    wx.makePhoneCall({
      phoneNumber: '18829354965'
    })
  },
  showImg: function (e) {
    var imgUrl = e.target.dataset.url;
    console.log(imgUrl);
    wx.previewImage({ urls: [imgUrl] })
  },
  newsContent: function (e) {//跳转新闻内容页面
    // console.log(e)
    var newsdata = e.currentTarget.dataset.newsdata;
    wx.navigateTo({ url: '/pages/news/newscontent?newsdata=' + JSON.stringify(newsdata) })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  getTopic: function (e) {
    var topicdata = e.currentTarget.dataset.topicdata;
    wx.navigateTo({
      url: '/pages/index/topics/topicscontent?topicdata=' + JSON.stringify(topicdata),
    })
  },
  onShow: function () {
    var that = this;
    wx.request({//获取新闻数据
      url: 'https://www.nwsuaforchestra.cn/getNewsList',
      data: {
        start: 0,
        size: 3
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          newsList: res.data.newsList.sort(function (a, b) {//按时间顺序排序显示
            var atime = a.info.time.slice(5).replace(/[//:-\s]/g, "") - 0;
            var btime = b.info.time.slice(5).replace(/[//:-\s]/g, "") - 0;
            return btime - atime;
          })
        })
      },
      fail: function (res) {
        console.log('服务器错误')
      }
    })
    wx.request({//获取话题数据
      url: 'https://www.nwsuaforchestra.cn/getTopicsList',
      data: {
        start: 0,
        size: 3
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          topicsList: res.data.topicsList
        })
      },
      fail: function (res) {
        console.log('服务器错误')
      }
    })
  },
  motto: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: "ease-in-out",
    })
    // console.log(that.data.animationDir)
    that.setData({
      animationDir: that.data.animationDir * (-1)
    })
    if (that.data.animationDir == -1){
      animation.rotateY(360).step();
    }else{
      animation.rotateY(0).step();
    }
    that.setData({
      animationData: animation.export()
    })
  }
})
