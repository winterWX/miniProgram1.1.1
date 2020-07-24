const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
     forceNum:false,
     startStatus:true,
     anBackShow:false,
     startStep: '10000',
     stepsNum:{
        todaySteps: 0,	//今日步数
        targetSteps: 0,	//	目标步数
        receiveStatus: 0,	//	领取状态(1:已领,2:未领,3:补领)
        receiveStatusName: 0,	//	领取描述
        isDone: 0,	//	完成状态(1:完成,2:未完成)
        isDoneName: 0,	//	完成描述
        integral: 0	//	可以领取的积分
     },
    isDone:2,
     btnStatus: -1,   // 0还差  1领积分  2已领
     distance: '00',
     calories: '00',
     totalTime: '00',
     leftDire: 750/2 + 120,
     topDire: 240 / 2,
     goldAnimationShow: false,
     flag:false,
     guidance1:false,
     guidance2:false,
     firstInitShow: true,  //第一次进来显示
     iconPath: '../../images/icon-10-points@2x.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       let that = this;
       if(options.id){
            that.setData({
              flag:true
            })
            that.setData({
              guidance1:true
            })
       }
      that.settingDataBtn();
      that.healthEveryday();
      //that.selectComponent('#progressView2').drawProgressBar();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  guidanceOne:function(){
     let that = this;
     that.setData({
         guidance1:false
     })
     that.setData({
          guidance2:true
     })
  },
  guidanceTwo:function(){
      let that = this;
      that.setData({
        guidance2: false
      })
      that.setData({
        flag: false
      })
      app.firstInit.bootImage = false;
  },
  healthShow:function(){
    wx.navigateTo({
      url: '../../pages/dailyHealthData/index',
    })
  },
  todayIntegral(data){//组件中领取今天的积分
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
  yesterdayIntegral(){//领取昨天的积分
    this.setData({
      anBackShow: true
    })
  },
  settingDataBtn(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/today/step/enquiry',
      method:"GET",
      header:{
          "Content-Type":"application/json;charset=UTF-8",
          "token": app.globalData.token
      },
      success: function (res) {
        if(res.data.data !== null){
          that.setData({
            stepsNum: res.data.data
          })
          wx.setStorageSync('stepsNumObject', res.data.data);
          if(res.data.data !== null){
               let targetStepsNum = 10000;
               if(res.data.data.todaySteps && res.data.data.todaySteps < 10000){
                    that.setData({
                        startStep : targetStepsNum - res.data.data.todaySteps
                    })
                    that.setData({
                        btnStatus: 0
                    })
               }else if(res.data.data.todaySteps === 10000){
                    that.setData({
                      btnStatus: 1,
                      isDone:1

                    })
               }
               that.setData({
                startStatus:false
               })
          }
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  topSettingBtn:function(){
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
        // if(res.data.data !== null){}
          that.setData({
            anBackShow:true
          })
          that.startAnimation();
          that.setData({
              btnStatus: 2,
            stepsNum: {           
              receiveStatus: 1,	           
              isDone: 1,	
              integral: 10	
            }
          })
          that.setData({
              forceNum: true
          })          
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
        'date': parseInt(new Date().getTime() /1000)
      },
      success: function (res) {
        if(res.data.data !== null){
            that.setData({
                distance:res.data.data.distance
            })
            that.setData({
              calories:res.data.data.distance
            })
            that.setData({
              totalTime:res.data.data.distance
            })
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
  }
})