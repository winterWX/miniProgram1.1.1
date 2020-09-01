const util = require('../../utils/util')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    health:{
      todaySteps: '--',
      stepRate:'--',
      totalTime:'--',
      calories:'--',
      distance:'--',
      bmi:'--',
      height:'--',
      weight:'--',
      bpm:'--'
    },
    editBlck: false,
    blockForData:{
      // editBlck: false,
      // titleTop:'',
      // blockText:'',
      // blockTextAfter:''
    },
    integral:100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHealthData();
    this.getHeightWeight(); //身高体重
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
  onShareAppMessage: function () {

  },
  getHealthData() {
    wx.showLoading({
      title: 'loading...',
    })
    const parms = {
      date: Date.parse(new Date()) / 1000
     
    }
    wx.request({
      method: 'post',
      url: app.globalData.baseUrl + '/remote/health/data/everyday',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token
      },
      data: parms,
      success: (res) => {
        if (res.data.code === 200) {
         this.setData({
           health:res.data.data
         })
        } else {
          wx.showModal({
            showCancel: false,
            content: res.message,
            success: (res) => { }
          })
        }
        wx.hideLoading()
      }
    })

  },
  nagigateStep: function() {
    wx.navigateTo({
      url: '../step/index',
    })
  },
  healthbmi:function(){
    let that = this;
    let healthProp = JSON.stringify(that.data.health)
    wx.navigateTo({
      url: '../../pages/healthBMI/index?initData='+ healthProp,
    })
  },
  movementData:function(){
    wx.navigateTo({
      url: '../../pages/movementData/index',
    })
  },
  heightWeightFun:function(e){
    let that = this;
    let flag = e.currentTarget.dataset.id;
    that.setData({ 
      editBlck: true,
    })
    let blockForData = {
      titleTop: flag === 'height' ? '记录身高' : '记录体重',
      blockText: flag === 'height' ? '身高':'体重',
      blockTextAfter: flag === 'height' ? '（厘米）': '（公斤）'
    }
    that.setData({ 
      blockForData: JSON.parse(JSON.stringify(blockForData)),
    })
  },
  getHeightWeight:function(){
    let that = this;
    wx.request({
      method: 'GET',
      url: app.globalData.baseUrl + '/remote/bodyData/search',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token
      },
      success: (res) => {
        if (res.data.data !== null) {
            // let heightWeight ={
            //     height: res.data.data.height,
            //     weight: res.data.data.weight
            // }
            // that.setData({
            //   health: Object.assign(this.data.health,heightWeight)
            // })
            that.setData({
              health: Object.assign(this.data.health,res.data.data)
            })
        }
      }
    })
  },
 closeBalck:function(event){
  let that = this;
  if (!event.detail.close){
        that.setData({
          editBlck: false
        })
      this.getHeightWeight(); //身高体重
     }
  },
  getWeRunStepsData: function () {
    let that = this;
    wx.login({
      success: (res) => {
            console.log('code----',res.code);
            wx.getWeRunData({
              success(resRun) {
                const encryptedData = resRun
                console.info(resRun);
                wx.request({
                  url: app.globalData.baseUrl + '/remote/oauth/mini/getEncryptedData',
                  method: 'GET', 
                  header: {
                    'Content-Type': 'application/json',
                    "token": app.globalData.token
                  },
                  data: {
                    encryptedData: resRun.encryptedData,
                    iv: resRun.iv,
                    sessionkey : app.globalData.userInfo.session_key
                  },
                  success: function (resDecrypt) {
                    if(resDecrypt.data.data !== null){
                          let runData = JSON.parse(resDecrypt.data.data); 
                          if (runData.stepInfoList.length > 0)
                          {
                            runData.stepInfoList = runData.stepInfoList.reverse()
                            for (var i in runData.stepInfoList)
                            {
                              runData.stepInfoList[i].date = util.formatTime(new Date(runData.stepInfoList[i].timestamp*1000)).split(' ')[0]
                            }
                            that.setData({ runData: runData.stepInfoList });
                            app.globalData.runData = runData.stepInfoList;
                            console.log('1212121212',that.data.runData);
                          }
                          //记录领取积分
                          that.getintegral(); 
                     } 
                  },
                  fail: function () {
                      console.log('-----------------')
                  }
                });
              }
            })
        }
    })
  },
  getintegral: function () {
    wx.request({
      method: 'GET',
      url: app.globalData.baseUrl + '/remote/integral/stepAuth',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token
      },
      success: (res) => {
        if (res.data.code === 200) {
            app.healthStep.integralRecord = true  //授权已领
        }
      }
    })
  },
})