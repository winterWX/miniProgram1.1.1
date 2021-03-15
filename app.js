let imagesUrl = 'https://ifc.wellness.hangseng.com:8443/images/miniprogram';
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
    baseTextUrl:'https://ifc.wellness.hangseng.com:8443',
    baseUrl:'https://ifc.wellness.hangseng.com:8443',
    imagesUrl: 'https://ifc.wellness.hangseng.com:8443/images/miniprogram',
    token: '',
    phoneNumber: '',
    isLogin : 0,  //未登录
    loginSuccess: false,
    isWeRunSteps:false,
    isWeRunStepsFail:false,
    isReceiveStatus:false,
    invitationCode:'',   //邀请码
    sessionFail:false,
    //artcleFlg:false,  // 文章弹窗时不让显示
    avatarObjList: [
      {
        url: imagesUrl + '/images/icnImage/icon/icon-defult-touxiang@2x.png', 
        id: 0,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-laoshu@2x.png',  
        id: 1,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-niu@2x.png',  
        id: 2,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-laohu@2x.png',  
        id: 3,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-tuzi@2x.png',  
        id: 4,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-long@2x.png',  
        id: 5,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-she@2x.png', 
        id: 6,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-ma@2x.png', 
        id: 7,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-yang@2x.png', 
        id: 8,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-houzi@2x.png',  
        id: 9,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-ji@2x.png', 
        id: 10,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-gou@2x.png', 
        id: 11,
      },
      {
        url: imagesUrl + '/images/icnImage/icon/icon-zhu@2x.png', 
        id: 12,
      },
    ],
    //二维码参数
    miniQwx:{
      type: 0,
      phoneNumber: null
    }
  },
  firstTimeLogin: false, //绑定数据的时候的法律法规弹窗 和 首次登录
  firstTimeLook: false, //第一次登录查看文章时
  firstInit:{ bootImage: true },
  //健康资讯全局变变量的设置
  healthInforData:{
    findMore: true    //发现更多 close按钮的设置
  },
  healthStep:{
    SynchronousData :false,  // 是否已经立即授过权 同步数据
    integralRecord :false,   //标记是否领取
    dataCource: 0,   // 2 app 用户， 1 mini用户
    APPSource: ''   //APP 数据源
  }
})