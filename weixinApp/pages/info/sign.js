// pages/info/sign.js
Page({
  data: {
    userData: {
      logo: '',
      username: '',
      sex: '',
      passwd: '',
      date: '请选择日期',
      email: ''
    },
    location: '',
    date: '请选择日期',
    logo_src: 'https://www.nwsuaforchestra.cn/images/avatar.png'
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  signsubmit: function (event) {
    var formData = event.detail.value,
      filePath = this.data.logo_src;

    //表单验证
    if(formData.date==='请选择日期'){
      formData.date = '';
    }
    if(filePath=='https://www.nwsuaforchestra.cn/images/avatar.png'||formData.user==''||formData.passwd==''){
      wx.showModal({
        title:'提交失败',
        content:'请正确输入必填项',
        showCancel:false
      })
      return;
    }
    if(formData.passwd!==formData.checkpasswd){
      wx.showModal({
        title:'提交失败',
        content:'两次输入的密码不同',
        showCancel:false
      })
      return;
    }
    console.log(formData)

    wx.uploadFile({
      url: 'https://www.nwsuaforchestra.cn/sign',
      filePath: filePath,
      name: 'logo',
      header: { 'content-type': 'multipart/form-data' }, // 设置请求的 header
      formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        if (res.statusCode === 200) {
          if (JSON.parse(res.data).success) {
            wx.showToast({
              title: '注册成功',
              success: function () {
                wx.navigateBack()
              }
            })
          } else {
            // console.log(JSON.parse(res.data).success)
            wx.showToast({
              title: '已存在的用户名',
              icon: 'loading'
            })
          }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '注册失败',
          icon: 'loading'
        })
      }
    })
  },
  userLogo: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var picurl = res.tempFilePaths[0];
        that.setData({
          logo_src: picurl
        })
        //参考资料 http://www.cnblogs.com/pingfan1990/p/4701355.html
      }
    })
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.setNavigationBarTitle({
      title: '注册账号'
    })
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