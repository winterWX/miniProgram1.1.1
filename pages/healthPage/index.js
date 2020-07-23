// pages/healthPage/index.js
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
     btnStatus:0  // 0 开启 1 领积分 2已领 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
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
        url: app.globalData.baseUrl +'/remote/today/step/receiveIntegral',
        method: "GET",
        header:{
            "Content-Type":"application/json;charset=UTF-8",
            "token": app.globalData.token
        },
        success: function (res) {
          console.log('res====',res);
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
         data: Date.parse(new Date())
      },
      success: function (res) {
        if(res.data.data !== null){

            
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  }
})