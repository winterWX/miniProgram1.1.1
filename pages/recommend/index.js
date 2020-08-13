const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCanDraw: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this;
    that.recommendNum();
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
  createShareImage() {
    this.setData({
      isCanDraw: !this.data.isCanDraw
    })
  },
  //邀请码  
  recommendNum: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/myTopic/batchUpdateMyTopic',
      method: "POST",
      data: {},
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {

      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  }
})