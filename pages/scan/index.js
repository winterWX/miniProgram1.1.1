let app = getApp();
// 移动动画
let animation = wx.createAnimation({});
Page({
  data: {
    show: true
  },
  onLoad: function () {
    
  },
  onShow(){
    this.donghua()
  },
  donghua(){
    var that = this;
	// 控制向上还是向下移动
    let m = true
    setInterval(function () {
      if (m) {
        animation.translateY(210).step({ duration: 1500 })
        m = !m;
      } else {
        animation.translateY(5).step({ duration: 1500 })
        m = !m;
      }

      that.setData({
        animation: animation.export()
      })
    }.bind(this), 1500)
  },
  scancode(e){
    // 校验扫描结果，并处理
    if ( e.detail.type === 'qrcode' && e.detail.result) {
      this.setData({show: false});
      wx.showToast({
        icon: 'loading',
        duration: 2000
       })
      wx.request({
        url: app.globalData.baseUrl + '/qrcode/scan/hospital?code=' + e.detail.result,
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        success: function (res) {
          wx.navigateTo({
            url: '../signSuccess/index',
          })
        },
        fail: function (res) {
          wx.navigateTo({
            url: '../signFail/index',
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../signFail/index',
      })
    }
  }
})

