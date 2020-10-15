// pages/offlineAppointment/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://www.cuclinic.hk/en/my_appointment/?cid=123&tid=345&mti=456'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  copyData: function() {
    let { url } = this.data;
    wx.setClipboardData({
      data: url,
      success: (res) => {
        console.log('success');
      },
      fail: (res) => {
        console.log('fail');
      },
      complete: () => {
        console.log('complete');
      }
    })
  }
})