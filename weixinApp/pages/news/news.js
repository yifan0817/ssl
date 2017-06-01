// pages/news/news.js
Page({
  data: {
    newsList: []
  },
  newsContent: function (e) {//跳转新闻内容页面
    // console.log(e)
    var newsdata = e.currentTarget.dataset.newsdata;
    wx.navigateTo({ url: 'newscontent?newsdata=' + JSON.stringify(newsdata) })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '乐团新闻'
    })
    // 页面初始化 options为页面跳转所带来的参数
    // wx.request({//添加新闻数据
    //   url: 'https://www.nwsuaforchestra.cn/insertNewsList',
    //   data: this.data.newsList[0],
    //   method: 'POST',
    //   success: function(res){
    //     console.log(res)
    //   }
    // })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '帆哥为你加载~~',
    })
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/getNewsList',
      data: {
        start: 0,
        size: 5
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
        wx.hideLoading()
      },
      fail: function (res) {
        console.log('服务器错误')
      }
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})