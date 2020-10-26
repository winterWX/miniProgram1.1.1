const app = getApp();
const authorizeRun = require('../../utils/authorizeRun.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
     forceNum:false,
     allowRun:false,
     startStatus:false,
     anBackShow:false,
     startStep: 10000,
     showAPPData: 0, 
     stepsNum:{
        todaySteps: 0,	 //今日步数
        targetSteps: 0,	 //	目标步数
        receiveStatus: 0,	 //领取状态(1:已领,2:未领,3:补领)
        receiveStatusName: 0,	 //	领取描述
        isDone: 0,	 //	完成状态(1:完成,2:未完成)
        isDoneName: 0,	 //	完成描述
        integral: 0	 //	可以领取的积分
     },
     isDone:2,
     btnStatus: 0,  // 0 还差，1领积分，2已领
     everyDayData:{
        distance: 0,
        calories: 0,
        totalTime: 0,
        todaySteps:0
     }, 
     leftDire: 750/2 + 120,
     topDire: 240 / 2,
     goldAnimationShow: false,
     flag:false,
     guidance1:false,
     guidance2:false,
     firstInitShow: true,  //第一次进来显示
     iconPath:app.globalData.imagesUrl + '/images/icon-10-points@2x.png',
     dataSyn: false //标记数据同步
  },
  onLoad:function (options) {
       let that = this;
       that.setData({
          showAPPData: app.healthStep.dataCource
       })
       if(options.id ==='allowTo'){ 
            that.setData({
              flag: true,
              guidance1: true
            })
            that.settingDataBtn();
            that.healthEveryday();
            that.getQueryintegral();
        }else if(options.flg ==='refusedTo'){
            if(app.globalData.isWeRunStepsFail){
              that.settingDataBtn();
            }else{
              that.setData({
                btnStatus: -1, 
                startStatus :true
              })
            }
            that.healthEveryday();
        }else if(options.flg ==='carryAPPData'){
            that.settingDataBtn();
            that.healthEveryday();
            //判断是否有app数据
            if(that.data.stepsNum.todaySteps === 0 && that.data.totalTime === 0){
                that.setData({
                  startStatus :true
                })
            }
        }
  },
  onReady: function () {
  },
  onShow: function () {
      let that = this;
      that.setData({
        firstInitShow: app.firstInit.bootImage
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    wx.showNavigationBarLoading();    //在当前页面显示导航条加载动画
    if(app.globalData.isWeRunSteps){
      that.calloutfun();
    }
    setTimeout(function(){
        wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
        wx.stopPullDownRefresh();    //停止下拉动作
    },1000)
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  //刷新的时候上传数据
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
            //数据同步完成再重新加载
            let options ={id:'allowTo'};
            that.onLoad(options); //刷新页面
            that.setData({
              guidance1: false,
              guidance2: false,
              firstInitShow:false
            })
            console.log('数据同步成功')
        }
      }
    })
  },
  guidanceOne:function(){
     let that = this;
     that.setData({
         guidance1: false,
         guidance2: true
     })
  },
  guidanceTwo:function(){
      let that = this;
      that.setData({
        guidance2: false,
        flag: false
      })
      app.firstInit.bootImage = false;
  },
  healthShow:function(){
    wx.navigateTo({
      url: '../../pages/dailyHealthData/index',
    })
  },
  todayIntegral(data){  //组件中领取今天的积分
    var that=this
    that.setData({
      anBackShow: true
    })
    that.startAnimation();
    that.setData({
      btnStatus: 2,
      stepsNum: {
        todaySteps: 10000,
        receiveStatus: 1,
        isDone: 1,
        integral: 10
      }
    })
    that.setData({
      forceNum: true
    })       
  },
  yesterdayIntegral(){  //领取昨天的积分
    this.setData({
      anBackShow: true
    })
  },
  settingDataBtn(){
    var that = this;
    app.healthStep.SynchronousData = true;
    app.globalData.isWeRunStepsFail = true;
    that.getQueryintegral();
    wx.request({
      url: app.globalData.baseUrl +'/remote/today/step/enquiry',
      method: "POST",
      header:{
          "Content-Type":"application/json;charset=UTF-8",
          "token": app.globalData.token
      },
      data:{
        souce:'string',
        type:'MINIP'
      },
      success: function (res) {
          if(res.data.code === 200){
             let targetStepsNum = 10000;
             let todayStepsInit = 0;
             if(res.data.data.todaySteps === null){
                res.data.data.todaySteps = todayStepsInit;
             }else{
                todayStepsInit = res.data.data.todaySteps;
             }
             that.setData({ stepsNum: res.data.data });
             if(todayStepsInit < 10000){
                  that.setData({ startStep : targetStepsNum - todayStepsInit, btnStatus: 0});
              }else if(todayStepsInit >= 10000){
                  if(app.globalData.isReceiveStatus){
                      //返回乐健康，第二次进来，默认已选的状态
                      that.setData({ btnStatus: 2, isDone:1 });
                      that.setData({
                        stepsNum: {     
                          todaySteps: todayStepsInit,   
                          receiveStatus: 1,	           
                          isDone: 1,	
                          integral: 10	
                        }
                      })
               }else{
                  that.setData({ btnStatus: 1, isDone:1 });
                }
          }
          that.setData({ startStatus: false });
          }else{
            that.setData({
              startStep: 10000,
              btnStatus: 0,
              startStatus: false
            })
          }
      },
      fail: function (res) {
          console.log('--------------');
      }
    })
  },
  integralBtn:function(){
    let that = this;
    if(that.data.btnStatus === 1 ){
      wx.request({
        url: app.globalData.baseUrl +'/remote/today/receiveIntegral',
        method: "GET",
        header:{
            "Content-Type":"application/json;charset=UTF-8",
            "token": app.globalData.token
        },
        success: function (res) {
        if(res.data.code !== null){
            that.setData({
              anBackShow:true
            })
            that.startAnimation();
            that.setData({
              btnStatus: 2
            })
            app.globalData.isReceiveStatus = true;  // 标记第二次进来
            that.setData({
              stepsNum: {
                todaySteps: 10000,           
                receiveStatus: 1,	           
                isDone: 1,	
                integral: 10	
              }
            })
            that.setData({
              forceNum: true
            })
          }          
        },
        fail: function (res) {
          console.log('.........fail..........');
        }
      });
    }
  },
  healthEveryday:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/health/data/everyday',
      method:"POST",
      header:{
          "Content-Type":"application/json;charset=UTF-8",
          "token": app.globalData.token
      },
      data:{
        //date: parseInt(new Date().getTime() /1000)
        date: new Date().getTime() + '',
      },
      success: function (res) {
        if(res.data.code === 200){
            that.setData({ everyDayData : res.data.data });
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  startAnimation:function(){
    var animation = wx.createAnimation({
        duration: 2000,
        timingFunction: 'ease',
        delay: 0
    });
    animation.opacity(0.01).translate(0, 250).step()
    this.setData({
      ani: animation.export()
    })
    this.setData({
      animationShow: false
    })
  },
  gotoDailyHeathdata(){
    wx.navigateTo({
      url: '../dailyHealthData/index',
    })
  },
  //查询用户是否已经获取步数积分
  getQueryintegral: function () {
      let that= this;
      wx.request({
        method: 'GET',
        url: app.globalData.baseUrl + '/remote/integral/queryReceivedStatus',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        success: (res) => {
          // 100412--已经领取积分  200--未领取积分
          if (res.data.code === 200) {
              that.getintegral();
          }
        }
      })
  },
  //领取积分
  getintegral: function () {
      let that= this;
      wx.request({
        method: 'GET',
        url: app.globalData.baseUrl + '/remote/integral/stepAuth',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        success: (res) => {
          if (res.data.code === 200) {
              that.setData({
                forceNum : app.healthStep.SynchronousData,
                allowRun : true 
              })
          }
        }
      })
  },
  stepRunSorce:function(){
    wx.navigateTo({
      url: '../../pages/heroList/index',
    })
  }
})