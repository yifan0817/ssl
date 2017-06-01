// pages/index/pictures.js
let col1H = 0;
let col2H = 0;
let listLength = 0;
let loading = false;
Page({
  data: {
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    pulldown:'下拉加载更多图片'
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        //加载首组图片
        this.loadImages();
      }
    })
  },
  onImageLoad: function (e) {
    wx.hideToast()
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }
    // console.log(imageObj)
    imageObj.height = imgHeight;

    listLength++;
    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    //判断当前图片添加到左列还是右列
    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images = [];
      loading = false;
    }

    this.setData(data);
  },

  loadImages: function () {
    if(loading){
      return;
    }
    wx.showToast({
      title:'正在加载',
      icon:'loading',
      duration:10000
    })
    loading = true;
    var that = this;
    wx.request({
      url: 'https://www.nwsuaforchestra.cn/getPics',
      data: {
        startIndex: listLength
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if(!res.data.success){//没有更多图片
          that.setData({
            pulldown:'没有更多图片',
            loading:false
          })
          wx.hideToast();
          return;
        }

        let images = res.data.list

        let baseId = "img-" + (+new Date());

        for (let i = 0; i < images.length; i++) {
          images[i].id = baseId + "-" + i;
        }

        that.setData({
          loadingCount: images.length,
          images: images
        });
      },
      fail: function (res) {
        console.log('服务器错误');
      }
    })
  },
  showImg: function (e) {
    var imgUrl = e.target.dataset.url;
    console.log(imgUrl);
    wx.previewImage({ urls: [imgUrl] })
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
    listLength = 0;
    loading = false;
  }
})