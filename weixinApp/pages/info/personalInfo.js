// pages/info/personalInfo.js
Page({
  data:{
    userData:{},
    disabled:true,
    logo_url:''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '个人资料'
    })
    this.setData({
      userData:wx.getStorageSync('userInfo'),
      logo_url:wx.getStorageSync('userInfo').avatarUrl
    })
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