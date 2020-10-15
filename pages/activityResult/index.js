let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    baseUrl: app.globalData.imagesUrl,
    defaultIcon: app.globalData.imagesUrl + '/images/pagePng/icon-defult-touxiang.png',
    self: {},
    success: true,
    avatarObjList: [
      {
        url: app.globalData.imagesUrl + '/images/pagePng/icon-defult-touxiang.png',
        id: 13
      }, {
        url: app.globalData.imagesUrl + '/images/icon/icon-laoshu.png',
        id: 1
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconNiu.png',
        id: 2
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconLaohu.png',
        id: 3
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconTuzi.png',
        id: 4
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconLong.png',
        id: 5
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconShe.png',
        id: 6
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconMa.png',
        id: 7
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconYang.png',
        id: 8
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconHouzi.png',
        id: 9
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconJi.png',
        id: 10
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconGou.png',
        id: 11
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconZhu.png',
        id: 12
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id, success } = options;
    this.setData({id, success: success === 'true'});
    this.getActivityInfo(id);
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
  getActivityInfo: function(id) {
    let that = this;
      wx.showToast({ title: '加载中', icon: 'loading' });
      wx.request({
        url: app.globalData.baseUrl + '/remote/myactivity/friend/rank/' + id,
        method: "POST",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        success: function (res) {
          wx.hideToast();
          if (res.data.code == 200) {
            let { self } = res.data.data;
            that.setData({self});
          }
        },
        fail: function (res) {
          wx.hideToast();
        }
      })
  },
  navigateDetail: function() {
    let { id } = this.data;
    wx.navigateTo({
      url: '../activityDetail/index?id=' + id
    })
  }
})