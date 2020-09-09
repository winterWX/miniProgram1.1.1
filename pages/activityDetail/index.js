let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id='', title='活动详情'} = options;
    wx.setNavigationBarTitle({
      title: title,
    })
    this.getActivityDetail(id);
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
  getActivityDetail: function(id) {
    let that = this;
    wx.showToast({title: '加载中', icon: 'loading'});
    wx.request({
      url: app.globalData.baseUrl + '/remote/myactivity/detail/' + id,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.code == 200) {
          console.log(res.data.data);
          that.setData({detail: res.data.data});
        }
      },
      fail: function (res) {
        wx.hideToast();
      }
    })
  }
})