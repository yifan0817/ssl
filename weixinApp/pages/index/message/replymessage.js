// pages/index/message/replymessage.js
Page({
  data:{
    innermessages:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '评论内容'
    })
    var mes = JSON.parse(options.data);
    this.setData({
      innermessages:mes
    })
    if(!mes.length){
      wx.showModal({
        title: '此条留言无评论内容',
        complete:function(){
          wx.navigateBack({delta: 1})
        }
      });   
    }
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