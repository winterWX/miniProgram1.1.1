let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityList: [],
    loadingFinish: false,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivityList(1);
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
    console.log('>>>>>>>>>>')
    this.setData({page: 1, activityList: [], loadingFinish: false});
    // this.data.activityListL = [];
    this.getActivityList(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let page = this.data.page + 1;
    this.getActivityList(page);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getActivityList: function(page) {
    let that = this;
    wx.showToast({title: '加载中', icon: 'loading'});
    wx.request({
      url: app.globalData.baseUrl + '/remote/activity/list',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data: {
        currentPage: 1,
        pageSize: 10,
        "status": [
          {
            "status": 3
          }
        ]
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.code == 200) {
          let list = that.data.activityList;
          if (res.data.data.length === 0 && page > 1) {
            page = page - 1;
          }
          that.setData({activityList: [...list,...res.data.data], page, loadingFinish: true});
          wx.stopPullDownRefresh();
        }
      },
      fail: function (res) {
        if (page > 1) {
          page = page - 1;
        };
        that.setData({page, loadingFinish: true});
        wx.stopPullDownRefresh();
        wx.hideToast();
      }
    })
  }
})