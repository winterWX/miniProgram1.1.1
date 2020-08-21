//获取应用实例
const app = getApp()
Page({
  data: {
    active:0,
    successFlg: false
  },
  onLoad: function (options) {
    console.log('options.flag',options.flag)
    if (options.flag === true){   //是 true
      console.log('options.flag里面',options.flag)
        this.setData({
          successFlg: true
        })
      this.selectComponent('#filterCmp').restFilterDatas();
    }
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
      that.setData({
        successFlg: false
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
