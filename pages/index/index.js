//获取应用实例
const app = getApp()
Page({
  data: {
    active:0,
    successFlg: false
  },
  onLoad: function (options) {
    if (options.goodsId){
      this.setData({
        successFlg: true
      })
    }
    console.log('options.goodsId', options.goodsId);
    wx.showModal({
      title: '提示',
      content: options.id,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onShow: function () {
    this.setData({
      active: 0
    })
  },
  prograNum:function(){
    wx.navigateTo({
      url: '../healthPage/index',
    })
  },
  onShareAppMessage: function () {},
  parentCallBack: function (event){
    let that = this;
    if (event.detail.handleSuccess){
     wx.showModal({
      title: '提示',
      content: '请前往APP应用商店下载，立即体验',
      success(res) {
        if (res.confirm) {
          that.setData({
            successFlg: false
          })
        } else if (res.cancel) {
          that.setData({
            successFlg: false
          })
        }
      }
    })
  }
  },
  myfindPage:function(){
    wx.navigateTo({
      url: '../../pages/HealthInformation/index',
    })
  },
  challengePage:function(){
    wx.navigateTo({
      url: '../../pages/challenge/index',
    })
  }
})
