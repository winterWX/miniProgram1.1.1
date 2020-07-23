// pages/dailyHealthData/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    health:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHealthData()
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

  }
})