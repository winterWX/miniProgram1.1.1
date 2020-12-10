const app = getApp();
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    level: 0,
    baseUrl: app.globalData.imagesUrl,
    showBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ level:options.level });
    if(options.level == 3 || options.level == 5){
      this.setData({ showBtn: true });
    }
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

  membership: function(){
    if(this.data.level == 1){
        wx.navigateTo({ url: '../../pages/strategy/index'});
    }else if(this.data.level == 2 || this.data.level == 4){
        wx.navigateTo({ url: '../../pages/goldStrategy/index'});
    }
  },

  moreActiveLink: function(){
      wx.navigateTo({ url: '../../pages/challenge/index'});
  }
})