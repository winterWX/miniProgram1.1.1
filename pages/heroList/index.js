let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friend: [],
    self: {},
    defaultIcon: app.globalData.imagesUrl + '/images/pagePng/icon-defult-touxiang.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id } = options;
    this.getHeroList(id);
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getHeroList: function(id) {
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
            console.log(res.data.data);
            let { friend, self } = res.data.data;
            that.setData({friend, self})
          }
        },
        fail: function (res) {
          wx.hideToast();
        }
      })
  }
})