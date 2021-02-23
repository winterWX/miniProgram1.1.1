const app = getApp();
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      paramsData: {},
      baseUrl: app.globalData.imagesUrl,
      showBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ paramsData : JSON.parse(options.params) });
    let { level, flg } = this.data.paramsData;
    if((level == 2 || level == 3 || level == 4 || level == 5 ) && flg === ''){
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

  membership : function(){
      let { level, flg } = this.data.paramsData;
      console.log('level',level);
      if(level == 1 || flg === 'X2'){
          wx.navigateTo({ url: '../../pages/strategy/index'});
      }else if(level == 2 || level == 4 || flg === 'X5'){
          wx.navigateTo({ url: '../../pages/goldStrategy/index'});
      }
  },

  moreActiveLink: function(){
      wx.reLaunch({ url: '../../pages/challenge/index'});
  }
})