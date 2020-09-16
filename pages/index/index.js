//获取应用实例
const app = getApp();
Page({
  data: {
    active:0,
    successFlg: false,
    allowTo: 'allowTo'
  },
  onLoad: function (options) {
    if (options.flag === 'true'){   //是 true
        this.setData({ successFlg: true })
        this.selectComponent('#filterCmp').restFilterDatas();
        console.log('新用户是否邀请成功',options.flag);
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
      url: '../healthPage/index?id='+ that.data.allowTo
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
  },
  /////////////////////////////////////////////////
  navigateToStep: function() {
    wx.navigateTo({
      url: '../healthPage/index?id=' + this.data.allowTo
    })
  }
})
