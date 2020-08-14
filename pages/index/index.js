//index.js
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
  onShareAppMessage: function (options) {
    let shareObj = {
      　　　　title: "",
      　　　　path: '/pages/index/index?id='+ 12,
             imageUrl: '',
      　　　　success: function (res) {
        　　　　　　// 转发成功之后的回调
        　　　　　　if (res.errMsg == 'shareAppMessage:ok') {
        　　　　　　}
      　　　　},
      　　　　fail: function () {
        　　　　　　// 转发失败之后的回调
        　　　　　　if (res.errMsg == 'shareAppMessage:fail cancel') {
          　　　　　　　　// 用户取消转发
        　　　　　　} else if (res.errMsg == 'shareAppMessage:fail') {
          　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
        　　　　　　}
      　　　　}
      // 　complete:fucntion(){
      // 　// 转发结束之后的回调（转发成不成功都会执行）
      // 　}
    　　}
    　　// 来自页面内的按钮的转发
    　　if (options.from == 'button') {
      let eData = options.target.dataset;
      　　　　console.log(eData.name);     // shareBtn
      　　　　// 此处可以修改 shareObj 中的内容
      　　　　shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    　　}
    　　// 返回shareObj
    　　return shareObj;
  },
  parentCallBack: function (event){
    if (event.handleSuccess){
      this.setData({
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
