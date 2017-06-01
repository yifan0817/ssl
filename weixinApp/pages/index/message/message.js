// pages/index/message.js
var checkLoad = require('../../../utils/checkLoad').checkLoad;
Page({
  data:{
    messages:[],
    input_mes:'',
    isfocus:false,
    innerreply:false,
    innerid:'',
    innermessages:[],
    holder:'请输入新的留言内容'
  },
  confirm:function(event){
    var that = this;
    if(that.data.innerreply){
      // console.log(that.data.innerid);
      var messages = that.data.innermessages;
      messages.unshift({
        content:event.detail.value,
        name:wx.getStorageSync('userInfo').nickName,
        time:that.getTime()
      })
      // console.log(messages)
      // return false;
      wx.request({//inner回复
        url: 'https://www.nwsuaforchestra.cn/postInnerMessages',
        data: {
          data:messages,
          messageID:that.data.innerid
        },
        method: 'POST',
        success: function(res){
          that.setData({
            isfocus:false,
            innerreply:false,
            innerid:'',
            innermessages:[],
            input_mes:''
          })
          if(res.data.success==1){
            wx.showToast({
              title:'评论成功',
              duration:1000,
              complete:function(){
                that.onReady();
              }
            })
          }
        },
        fail: function(res) {
          wx.showModal({
            title: '网络连接错误',
            content: '请联系帆哥~~',
            duration: 1500
          });
        }
      })

      that.setData({//恢复正常回复状态
        isfocus:false,
        innerreply:false,
        innerid:''
      })
      return;
    }
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/postMessages',
      data: {
        name:wx.getStorageSync('userInfo').nickName,
        time:that.getTime(),
        data:event.detail.value,
        good:[],
        reply:[],
        messageID:(Math.random()+'').slice(2)
      },
      method: 'POST',
      success: function(res){
        that.setData({
          input_mes:''
        })
        if(res.data.success==1){
          wx.showToast({
            title:'发送成功',
            duration:1000,
            complete:function(){
              that.onReady();
            }
          })
        }
      },
      fail: function(res) {
        // fail
        wx.showModal({
          title: '网络连接错误',
          content: '请联系帆哥~~',
          duration: 1500
        });
      }
    })
  },
  getTime:function(){
    var now = new Date();
    return now.toLocaleDateString()+' '+now.toTimeString().slice(0,8)
  },
  addgood:function(item){
    var that = this;
    var dataobj = item.target.dataset.obj;
    var messageid = dataobj.messageID;
    var good = dataobj.good;
    var userName = getApp().globalData.userInfo.nickName;
    //console.log(dataobj)
    if(good.indexOf(userName)>-1){//判断是否已经点过赞
      wx.showModal({
        title: '您已点过赞~~',
        duration: 1000
      });
      return;
    }
    good.push(userName);
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/addGood',
      data: {
        messageID:messageid,
        good:good
      },
      method: 'POST',
      success: function(res){
        if(res.data.success==1){
          wx.showToast({
            title:'点赞成功',
            duration:1000,
            complete:function(){
              that.onReady();
            }
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '网络连接错误',
          content: '请联系帆哥~~',
          duration: 1500
        });
      }
    })
  },
  reply:function(event){
    var item = event.target.dataset.obj;
    var itemid = item.messageID;
    // console.log(itemid)
    this.setData({
      isfocus:true,
      innerreply:true,
      innerid:itemid,
      innermessages:item.reply,
      holder:'请输入您的评论内容'
    })
  },
  losefocus:function(){//文本框失去焦点
    this.setData({
      isfocus:false,
      innerreply:false,
      innerid:'',
      innermessages:[],
      holder:'请输入新的留言内容'
    })
  },
  showreplyinfo:function(event){
    var item = event.target.dataset.obj;
    var replymes = item.reply;
    wx.navigateTo({url: 'replymessage?data='+JSON.stringify(replymes)})
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '留言板'
    })
  },
  onReady:function(){
    // 页面渲染完成
    wx.showLoading({
      title: '帆哥为你加载',
    })
    var that = this;
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/getMessages',
      method: 'GET',
      success: function(res){
        // success
        that.setData({
          messages:res.data.sort(function(a,b){//按时间顺序排序显示
            var atime = a.time.replace(/[//:\s]/g,"")-0;
            var btime = b.time.replace(/[//:\s]/g,"")-0;
            return btime-atime;
          })
        })
      },
      fail: function(res) {
        // fail
        wx.showModal({
          title: '网络连接错误',
          content: '请联系帆哥~~',
          duration: 1500
        });
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  onShow:function(){
    checkLoad()
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})