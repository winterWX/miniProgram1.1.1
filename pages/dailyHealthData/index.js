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
    blockForData:{},
    integral:100,
    integralBlock : false,
    tipUpdate: false,  //同步数据
    showAPPData: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({ showAPPData: app.healthStep.dataCource });
    if(app.healthStep.SynchronousData){
        that.setData({ tipUpdate : app.healthStep.SynchronousData });
        this.getHealthData();
        this.getHeightWeight();  //身高体重
        that.getQueryintegral();
    }
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
  getWeRunStepsData: function () {
    let that = this;
    app.healthStep.SynchronousData = true;
    that.setData({
      tipUpdate : app.healthStep.SynchronousData
    })
    this.getHealthData();
    this.getHeightWeight();  //身高体重
    that.getQueryintegral();
  },
  getHealthData() {
    let that = this;
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
        if (res.data.code === 200 &&  res.data.data !== null) {
          const {distance,calories,totalTime,bpm,weight,height} = res.data.data;
          if(weight > 0 && height > 0){
              let bmiNum = Number(weight) / Math.pow((Number(height) / 100),2);
              res.data.data.bmi = Number(bmiNum.toFixed(1));
          }else{
               res.data.data.bmi = that.data.health.bmi;
          }
          res.data.data.weight =  res.data.data.weight === 0 ?  '--' : res.data.data.weight;
          res.data.data.height =  res.data.data.height === 0 ?  '--' : res.data.data.height;
          res.data.data.bpm =  res.data.data.bpm === 0 ?  '--' : res.data.data.bpm;
          that.setData({health: res.data.data});
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
    if(!app.healthStep.SynchronousData){
      return;
    }else{
      wx.navigateTo({
        url: '../step/index',
      })
    }
  },
  healthbmi:function(){
    let that = this;
    if(!app.healthStep.SynchronousData){
        return;
    }else{
        let healthProp = JSON.stringify(that.data.health)
        wx.navigateTo({
          url: '../../pages/healthBMI/index?initData='+ healthProp,
        })
    }
  },
  movementData:function(){
    if(!app.healthStep.SynchronousData){
       return;
    }else{
      wx.navigateTo({
        url: '../../pages/movementData/index',
      })
    }
  },
  heightWeightFun:function(e){
      let that = this;
      if(!app.healthStep.SynchronousData){
           return;
      }else{
          let flag = e.currentTarget.dataset.id;
          let blockForData = {
            titleTop: flag === 'height' ? '记录身高' : '记录体重',
            blockText: flag === 'height' ? '身高':'体重',
            blockTextAfter: flag === 'height' ? '（厘米）': '（公斤）'
          }
          that.setData({
            editBlck: true, 
            blockForData: JSON.parse(JSON.stringify(blockForData)),
          })
      }
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
            const {weight , height} =  res.data.data;
            if(weight> 0  &&  height> 0){
                let bmiNum = Number(weight) / Math.pow((Number(height) / 100),2); 
                res.data.data.bmi = bmiNum.toFixed(1);
            }else{
                 res.data.data.bmi = that.data.health.bmi;
            }
            res.data.data.weight =  res.data.data.weight === 0 ?  '--' : res.data.data.weight;
            res.data.data.height =  res.data.data.height === 0 ?  '--' : res.data.data.height;
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
              integralBlock: app.healthStep.SynchronousData 
            })
        }
      }
    })
  }
})