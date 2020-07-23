//import lottie from 'lottie-miniprogram'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
     startStep: '还差10000步',
     stepsNum:{
        todaySteps: 0,	//今日步数
        targetSteps: 0,	//	目标步数
        receiveStatus: 0,	//	领取状态(1:已领,2:未领,3:补领)
        receiveStatusName: 0,	//	领取描述
        isDone: 0,	//	完成状态(1:完成,2:未完成)
        isDoneName: 0,	//	完成描述
        integral: 0	//	可以领取的积分
     },
     btnStatus:0,  // 0 开启 1 领积分 2已领
     distance: '00',
     calories: '00',
     totalTime: '00',
     leftDire: 750/2 + 120,
     topDire: 240 / 2,
     goldAnimationShow: false,
     flag:false,
     guidance1:false,
     guidance2:false,
     firstInitShow: true  //第一次进来显示
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
      that.todayStepenquiry();
      that.healthEveryday();
      that.selectComponent('#progressView2').drawProgressBar();
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
    console.log(data)
  },
  todayStepenquiry(){
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
          if(res.data.data !== null && res.data.data.todaySteps > 0 && res.data.data.todaySteps > 0){
               if(res.data.data.todaySteps === 10000 && res.data.data.targetSteps === 10000){
                that.setData({
                    btnStatus: 1
                  })
               }
          }else{
                that.setData({
                  btnStatus:0
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
    if(that.data.btnStatus !== 2 ){
      wx.request({
        url: app.globalData.baseUrl +'/remote/today/receiveIntegral',
        method: "GET",
        header:{
            "Content-Type":"application/json;charset=UTF-8",
            "token": app.globalData.token
        },
        success: function (res) {
        // if(res.data.data !== null){
            //  that.setData({
            //     goldAnimationShow: true
            //  })
            //  that.goldAnimation();
         //}
          that.setData({
            btnStatus: 2
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
            this.data.distance = res.data.data.distance;
            this.data.calories = res.data.data.calories;
            this.data.totalTime = res.data.data.totalTime;
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  // goldAnimation(){
  //   const query = wx.createSelectorQuery()
  //   query.select('#myCanvas')
  //     .fields({ node: true, size: true })
  //     .exec((res) => {
  //       const canvas = res[0].node
  //       const context = canvas.getContext('2d')
  //       //canvas.width = wx.getSystemInfoSync().windowWidth;   //设置宽高，也可以放到wxml中的canvas标签的style中
  //       //canvas.hight =  wx.getSystemInfoSync().windowHeight;
  //       canvas.width = 375;   //设置宽高，也可以放到wxml中的canvas标签的style中
  //       canvas.hight =  375;
  //      // console.log('-----',canvas.width,canvas.hight);
  //       lottie.setup(canvas)   //要执行动画，必须调用setup,传入canvas对象
  //       lottie.loadAnimation({    //微信小程序给的接口，调用就完事了，原理不太懂
  //         loop: false,       //是否循环播放（选填）
  //         autoplay: true,    //是否自动播放（选填）
  //         path: 'http://106.54.73.125:8102/images/score/10/data.json',  //lottie json包的网络链接，可以防止小程序的体积过大
  //         rendererSettings:{
  //           context   //es6语法：等同于context:context（必填）
  //         }
  //     })

  //     })
  // }
})