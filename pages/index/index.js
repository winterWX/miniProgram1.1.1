//获取应用实例
const app = getApp();
const util = require('../../utils/util');
const userLogin = require('../../utils/userLogin.js');
const authorizeRun = require('../../utils/authorizeRun.js');
Page({
  data: {
    isLogin: 0, // 0还未授权获取用户信息，1已经授权获取用户信息，2已经授权获取电话号码，3是已经登录
    active: 0,
    successFlg: false,
    allowTo: 'allowTo',
    indexStep: true,
    redirectToUrl: '', //调转的标记
    stepsNum:{},
    runDataText:0,
    showDialog:false
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
    if(app.globalData.isLogin === 3){
      this.setData({ isLogin: app.globalData.isLogin });
      this.getStepRunData();
    }
    this.homePageInit();
  },
  onShow: function () {
    this.setData({
      active: 0
    })
  },
  onPullDownRefresh: function () {
    let that = this;
    if(app.globalData.isLogin === 3){
        wx.showNavigationBarLoading();    //在当前页面显示导航条加载动画
        console.log('app.globalData.isWeRunSteps',app.globalData.isWeRunSteps);
        if(app.globalData.isWeRunSteps){
          that.calloutfun();
        }
        setTimeout(function(){
            wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
            wx.stopPullDownRefresh();    //停止下拉动作
        },1000)
    }else{
        wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
        wx.stopPullDownRefresh();    //停止下拉动作
    }
  },
  //调用微信运动数据
  calloutfun:function(){
      let that = this;
      let resultData = [];
      authorizeRun.getWxRunData(function(result){
        if(result.length > 0){
            resultData = result.splice(0,1).map(item=>{
                return {
                    endTime: item.timestamp + '',
                    startTime: item.timestamp + '',
                    steps: item.step
                }
            })
        }else{
          resultData = [];
        }
        that.getUploaddata(resultData);
        console.log('数据下拉更新',resultData[0].steps)
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
  navigateToStep: function() {
    wx.navigateTo({
      url: '../healthPage/index?id=' + this.data.allowTo
    })
  },
  onTabItemTap:function(){
    console.log('111111111111');
  },
  getUserInfo:function(e) { //获取用户信息
    let that = this;
    if (e.detail.userInfo) {
        userLogin.onLogin(function(result){
          that.data.isLogin = result.isLoginState;
          app.globalData.loginSuccess = result.isLoginState;
          app.globalData.userInfo = result.newUserInfo;
          app.globalData.userInfoDetail = result.newUserInfo;
          console.log('that.data.isLogin===',that.data.isLogin)
        },e.detail,that.data.isLogin,that.data.redirectToUrl)
    }
  },
  //获取运动步数
  getStepRunData: function () {
    let that = this;
    authorizeRun.getWxRunData(function(result){
        if(result.length > 0){
          //授权成功跳转获取步数
          app.globalData.runData = result;
          app.globalData.isWeRunSteps = true; //标志授权成功
          that.getQueryLatestime(result);
          that.stepRunState();
        }else{
          //拒绝授权
          that.setData({showDialog: true});
        }
    })
  },
  //最近上传数据时间查询(query- queryLatestime)|移动端
  getQueryLatestime: function (runData) {
      let that = this;
      wx.request({
        method: 'GET',
        url: app.globalData.baseUrl + '/remote/health/data/query/latestime',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        success: (res) => {
          if (res.data.code === 200) {
              //最后上传时间戳 和 当前时间戳进行比较
              let time = util.formatTime(new Date(Number(res.data.data)));
              let latestTime = time.split(' ')[0];
              let result = runData.find(item => item.date === latestTime);
              let index = runData.indexOf(result);
              let results = runData.splice(0, index + 1).map(item=>{
                   return {
                      startTime: item.timestamp + '',
                      endTime: item.timestamp + '',
                      steps: item.step
                   }
              });
              console.log('resultsresults+=====',results);
              that.getUploaddata(results);
          }
        }
      })
  },
  //运动数据同步上传
  getUploaddata: function (runData) {
    let that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/remote/health/data/uploaddata',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token
      },
      data:{
        bpm: 0,
        source :'string',
        type : 'MINIP',
        lastTime: new Date().getTime() + '',
        stepsDataModelList: runData,
      },
      success: (res) => {
        if (res.data.code === 200) {
            console.log('数据同步成功')
        }
      }
    })
  },
  stepRunState:function(){
    let that = this;
    app.healthStep.SynchronousData = true;
    app.globalData.isWeRunStepsFail = true;
    //that.getQueryintegral();
    wx.request({
      url: app.globalData.baseUrl +'/remote/today/step/enquiry',
      method: "POST",
      header:{
          "Content-Type":"application/json;charset=UTF-8",
          "token": app.globalData.token
      },
      data:{ souce:'string', type:'MINIP'},
      success: function (res) {
          if(res.data.code === 200){
              console.log('res.data.data',res.data.data);
              that.setData({
                stepsNum: res.data.data,
                runDataText: res.data.data.todaySteps >= 10000 ? 10000 : 10000 - Number(res.data.data.todaySteps)
              });
          }
      },
      fail: function (res) {
          console.log('--------------');
      }
    })
  },
getIntegral:function(){

},
closeModal: function() {
    this.setData({showDialog: false});
},
callback: function() {
    this.setData({showDialog: false});
},
homePageInit: function () {
  let that = this;
  wx.request({
    method: 'GET',
    url: app.globalData.baseUrl + '/remote/homePage/homePageActivitys',
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "token": app.globalData.token
    },
    success: (res) => {
      if (res.data.code === 200) {
          console.log('res.data=====',res.data.data)
          res.data.data.activity = res.data.data.activity.map(item =>{
             return {
               ...item,
               coverImage: typeof item.coverImage == 'number' ? '': item.coverImage,
               createTime : item.createTime ? util.timestampToTimeHM(item.createTime) : ''
             }
          });
          res.data.data.article = res.data.data.article.map(item =>{
            return {
              ...item,
              thumb: typeof item.thumb == 'number' ? '' : item.thumb,
              inputtime : item.inputtime ? util.timestampToTimeHM(item.inputtime) : ''
            }
         });
        this.setData({homeAllData: res.data.data});
      }
    }
  })
},

membership:function(){
  wx.navigateTo({                                 
    url: '../../pages/membership/index' 
  })
},
listClick(e){
    let goodsId = e.currentTarget.dataset.id;      
    wx.navigateTo({                                 
      url: '../../pages/HealthInforDetails/index?goodsId='+ goodsId      
    })
},
listChange(e){
  let {type,id,title} = e.currentTarget.dataset.item;
  if(type === '1'){
    wx.navigateTo({
      url: '../activityDetail/index?id=' + id + '&title=' + title
    })
  }else{
    // wx.navigateTo({                                 
    //   url: '../../pages/HealthInforDetails/index?goodsId='+ goodsId      
    // })
  }     
}


})
