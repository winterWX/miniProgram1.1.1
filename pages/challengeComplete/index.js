// pages/challengeComplete/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    reward: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id, reward=0 } = options;
    this.setData({id, reward});
  },
  navigateActivityResult: function() {
    wx.navigateTo({
      url: '../activityResult/index?id=' + this.data.id + '&success=' + true
    })
  }
})