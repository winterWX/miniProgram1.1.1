// pages/history/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollH:300,
    detail: { standardDays: 0, rewards: 0, runningDays:0},
    history:[
      {
        todaySteps:10000,
        receiveStatus:3,
        integral:10,
        isDone:1,
        time:1592222222222222

      },
      {
        todaySteps: 10000,
        receiveStatus: 1,
        integral: 10,
        isDone: 1,
        time: 1592222222222222

      },
      {
        todaySteps: 10000,
        receiveStatus: 1,
        integral: 0,
        isDone: 2,
        time: 1592222222222222

      },
      {
        todaySteps: 10000,
        receiveStatus: 1,
        integral: 10,
        isDone: 1,
        time: 1592222222222222

      },
      {
        todaySteps: 10000,
        receiveStatus: 1,
        integral: 0,
        isDone: 2,
        time: 1592222222222222

      },
      {
        todaySteps: 10000,
        receiveStatus: 1,
        integral: 10,
        isDone: 1,
        time: 1592222222222222

      },
      {
        todaySteps: 10000,
        receiveStatus: 1,
        integral: 0,
        isDone: 2,
        time: 1592222222222222

      },
      {
        todaySteps: 10000,
        receiveStatus: 1,
        integral: 10,
        isDone: 1,
        time: 1592222222222222

      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopHeight()
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
  formatDate(value){
    let date = new Date(value * 1000);
    let y = date.getFullYear();// 年
    let MM = date.getMonth() + 1;// 月
    MM = MM < 10 ? ('0' + MM) : MM;
    let d = date.getDate();// 日
    d = d < 10 ? ('0' + d) : d;
    let h = date.getHours();// 时
    h = h < 10 ? ('0' + h) : h;
    let m = date.getMinutes();// 分
    m = m < 10 ? ('0' + m) : m;
    let s = date.getSeconds();// 秒
    s = s < 10 ? ('0' + s) : s;
    //return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    return y + '/' + MM + '/' + d;
  },
  getTopHeight(){
    wx.createSelectorQuery().in(this).select('.headFix').boundingClientRect((rects) => {    
      console.log(wx.getSystemInfoSync().windowHeight,rects.height) 
      this.setData({
        scrollH: wx.getSystemInfoSync().windowHeight - rects.height-30
      })
    }).exec()
  },
  brandlowerShow(){

  }
})