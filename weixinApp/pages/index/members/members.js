// pages/index/members.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '团员风采'
    })
  },
  showImg: function (e) {
    var imgUrl = e.target.dataset.url;
    console.log(imgUrl);
    wx.previewImage({ urls: [imgUrl] })
  },
  imageLoad:function(){
    console.log('图片加载。。。');
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})