// pages/dailyHealthData/index.js
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
    }
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
        "token": 'eyJhbGciOiJIUzUxMiIsInppcCI6IkRFRiJ9.eNqqVirNTFGyUjJU0lFKrShQsjI0tTQ3NjcyMDGrBQAAAP__.41qr90hXJPhcy9-CTqZZxc_zS4AQsVkyMI19iYddeGJ2clgSySxF1Rb6Sw8NOf34m5-H6mDtdsoWE9xkeO3jww'
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
    wx.navigateTo({
      url: '../../pages/healthBMI/index',
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
            let heightWeight ={
                height: res.data.data.height,
                weight: res.data.data.weight
            }
            that.setData({
              health: Object.assign(this.data.health,heightWeight)
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
  }
})