//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    userInfoDetail: {
      nickName: '',
      gender: '',
      avatarUrl: '',
      phoneNumber: ''
    },
    runData: null,
    baseUrl:'http://106.54.73.125:8104',
    imagesUrl: 'http://106.54.73.125:8104/images/miniprogram',
    token: '',
    phoneNumber: '',
    loginSuccess: false,
    isWeRunSteps:false,
    isWeRunStepsFail:false,
    isReceiveStatus:false,
    invitationCode:''  //邀请码
  },
  firstInit:{
    bootImage: true
  },
  //健康资讯全局变变量的设置
  healthInforData:{
    findMore: true    //发现更多 close按钮的设置
  },
  healthStep:{
    SynchronousData :false,  // 是否已经立即授过权 同步数据
    integralRecord :false,   //标记是否领取
    dataCource: 0  //数据源 1.APP  2.miniPro
  }
})