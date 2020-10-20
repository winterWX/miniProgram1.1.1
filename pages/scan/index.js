let app = getApp();
// 移动动画
let animation = wx.createAnimation({});
let timer = null;
let isScan = false
Page({
  data: {
    show: true
  },
  onLoad: function () {
    clearInterval(timer);
  },
  onShow(){
    let that = this;
    this.donghua();
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.camera']) {
          that.setData({show: true});
        }
      },
    })
  },
  donghua(){
    var that = this;
	// 控制向上还是向下移动
    let m = true
    timer = setInterval(function () {
      if (m) {
        animation.translateY(260).step({ duration: 3000 })
        m = !m;
      } else {
        animation.translateY(5).step({ duration: 3000 })
        m = !m;
      }

      that.setData({
        animation: animation.export()
      })
    }.bind(this), 3000)
  },
  cameraError: function() {
    let that = this;
    this.setData({show: false});
    wx.showModal({
      title: '提示',
      content: '尚未进行授权，部分功能将无法使用',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.openSetting({      //这里的方法是调到一个添加权限的页面，可以自己尝试
            success: (res) => {
              console.log('confirm');
              console.log(res);
              if (!res.authSetting['scope.camera']) {
                wx.authorize({
                  scope: 'scope.camera',
                  success() {
                    console.log('相机授权成功了');
                    that.setData({show: true})
                  }
                })
              }
            },
            fail: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
          
        } else if (res.cancel) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  scancode(e){
    console.log(e);
    let that = this;
    this.setData({show: false});
    if (isScan) {
      return;
    }
    // 校验扫描结果，并处理
    if ( e.detail.type === 'qrcode' && e.detail.result) {
      let url = '';
      wx.showToast({
        icon: 'loading',
        duration: 2000
       })
      if (!isScan) {
        isScan = true;
        wx.request({
          url: app.globalData.baseUrl + '/qrcode/scan/hospital?code=' + e.detail.result,
          method: "GET",
          header: {
            'Content-Type': 'application/json',
            "token": app.globalData.token
          },
          success: function (res) {
            isScan = false;
            if(res.data.data) {
              let { integral } = res.data.data;
              url = '../signSuccess/index?integral=' + integral;
            } else {
              url = '../signFail/index';
            }
            that.setData({show: true});
            wx.navigateTo({url});
          },
          fail: function (res) {
            isScan = false;
            that.setData({show: true});
            wx.navigateTo({
              url: '../signFail/index',
            })
          }
        })
      }
      
    }
  }
})

