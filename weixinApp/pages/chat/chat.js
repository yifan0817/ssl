// pages/chat/chat.js
var checkLoad = require('../../utils/checkLoad').checkLoad;
Page({
  data: {
    message_array: [],
    socket: false,
    userData: {},
    top: '300',
    showUsers: false,
    online_users: 'none',
    users_array: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '大家来谝'
    })
  },
  inputblur: function (event) {//输入框失去焦点存值
    var that = this;
    that.setData({
      input_mes: event.detail.value
    })
  },
  showUsers: function () {//显示在线用户
    var that = this;
    if (that.data.showUsers) {
      that.setData({
        showUsers: false,
        online_users: 'none'
      })
    } else {
      wx.request({
        url: 'https://www.nwsuaforchestra.cn/getUserList',//www.nwsuaforchestra.cn
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          // success
          that.setData({
            users_array: res.data
          })
        }
      })
      that.setData({
        showUsers: true,
        online_users: '-webkit-flex'
      })
    }
  },
  sendmessage: function () {//发送信息按钮
    var that = this;
    setTimeout(function () {
      var mes = that.data.input_mes;
      if (mes == undefined || mes == '' || /^\s+$/g.test(mes)) {//判断空白
        wx.showModal({
          title: '请输入正确的内容！',
          cancelText: '呵呵',
          confirmText: '去洗澡'
        })
        return;
      }
      wx.sendSocketMessage({
        data: JSON.stringify({ data: that.data.input_mes, name: that.data.userData.nickName, time: new Date().toLocaleTimeString(), messageID: that.data.userData.nickName + new Date(), createTime: new Date().valueOf() }),
        success: function () {
          if (that.data.socket) {
            that.setData({
              input_mes: ''
            })
            //console.log('socket连接正常');
          } else {
            console.log('socket连接异常');
            wx.showModal({
              title: '网络连接错误',
              content: '这条信息没法出去呢，快联系帆哥',
              duration: 1500
            });
          }
        }
      })
    }, 200);
  },
  onReady: function () {
    // 页面渲染完成
  },
  messageCtrl: function (e) {//消息长按撤回事件
    var info = e.currentTarget.dataset.info,
      name = info.name,
      id = info.messageID;
    // console.log(info)
    if (id && name == wx.getStorageSync('userInfo').nickName) {
      wx.showModal({
        title: '确认撤回这条消息？',
        success: function (res) {
          if (res.confirm) {
            wx.sendSocketMessage({
              data: JSON.stringify({
                mesBack: true,
                name: name,
                messageID: id,
                createTime: info.createTime
              })
            })
          }
        }
      })
    }
  },
  onShow: function () {
    // 页面显示
    checkLoad()
    this.setData({
      userData: wx.getStorageSync('userInfo')
    })
    var that = this;
    if (!wx.getStorageSync('sessionid')) {
      console.log('未登录')
    } else {
      wx.connectSocket({
        //wss://www.nwsuaforchestra.cn wss://localhost
        url: "wss://www.nwsuaforchestra.cn",
        data: {},
        // header: {}, // 设置请求的 header
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        success: function (res) {
          // success
          console.log('connectSocket success');
          that.setData({
            socket: true
          });
        }
      })
    }
    wx.onSocketOpen(function (res) {
      // 连接成功并发送用户信息至服务器
      wx.sendSocketMessage({
        data: JSON.stringify({ login: true, name: that.data.userData.nickName, time: new Date().toLocaleTimeString() }),
        success: function (res) {
          // success
          console.log('初始消息发送成功...');
          // console.log(res);
        },
        fail: function (res) {
          // fail
          console.log('初始消息发送失败!');
          // console.log(res);
        }
      })
    })
    wx.onSocketMessage(function (res) {//返回消息监听
      //参考资料：http://blog.csdn.net/uniquelike/article/details/52574476
      var resData = JSON.parse(res.data);
      if (resData.backError){//撤回失败提示
        wx.showModal({
          title: '撤回失败',
          content: '只能撤回一分钟内发送的消息',
          showCancel:false
        })
        return;
      }
      //console.log(that.data.userData.nickName,resData.name)
      var mestype = (that.data.userData.nickName == resData.name) ? 'mymessage' : 'message'//是否己方消息;
      if (resData.name === '管理员') {//是否管理员消息;
        mestype = 'admin'
      }
      if (resData.history) {//历史消息
        // console.log(resData.messageList)
        var mes = resData.messageList;
        that.setData({//清空当前
          message_array: []
        });
      } else {//实时消息
        var mes = [{
          name: resData.name,
          content: resData.data,
          time: resData.time,
          type: mestype,
          messageID: resData.messageID,
          mesBack: resData.mesBack,
          createTime: resData.createTime
        }];
      }
      // console.log(mes);
      var _message_array = that.data.message_array;
      for (var i = 0; i < mes.length; i++) {
        if (mes[i].mesBack) {//为撤回消息
          // console.log('需要撤回：' + mes[i].messageID)
          for (var j = 0; j < _message_array.length; j++) {
            if (mes[i].messageID == _message_array[j].messageID) {
              // console.log('已经撤回：' + mes[i].messageID)
              // _message_array.splice(j,1);
              _message_array[j] = {
                content: _message_array[j].name+'撤回了一条消息',
                type: 'admin',
                name: '管理员'
              }
            }
          }
          continue;
        }
        var mesName = mes[i].name;
        var thistype = (that.data.userData.nickName == mesName) ? 'mymessage' : 'message'//是否己方消息;
        if (mesName === '管理员') {//是否管理员消息;
          thistype = 'admin'
        }
        mes[i].type = thistype
        _message_array.push(mes[i]);
      }
      that.setData({
        message_array: _message_array
      });
      // console.log(that.data.message_array)
      that.setData({//保持滚动条在最底部
        top: that.data.top - 0 + 80
      })
    });
    wx.onSocketError(function (e) {//错误监听
      console.log('connectSocket fail'+e);
      that.setData({
        socket: false
      });
      wx.showModal({
        title: '网络连接错误',
        content: '请联系帆哥~~',
        duration: 1500
      });
    });
  },
  onHide: function () {
    // 页面隐藏
    var that = this;
    wx.sendSocketMessage({
      data: JSON.stringify({ exit: true, name: that.data.userData.nickName, time: new Date().toLocaleTimeString() }),
      complete: function () {
        wx.closeSocket();
      }
    })
  }
})