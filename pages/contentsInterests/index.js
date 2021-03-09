const app = getApp();
const util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    level: 0,
    baseUrl: app.globalData.imagesUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userLevel();
    //this.setData({ level:options.level });
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
  userLevel:function(){
    let that = this;
    let method = 'GET';
    let url = app.globalData.baseUrl +'/remote/homePage/userlevel';
    that.selectComponent("#loading").show();
    util.wxAjax(method,url).then(res =>{
      if (res.data.code === 200) {
          res.data.data = res.data.data === 2 || 3 ? 1 : res.data.data;
          that.setData({ level: res.data.data });
      }
      that.selectComponent("#loading").hide();
    })
  },

  backUpgrade:function(){
    let that = this;
    if(that.data.level == 1){
      wx.navigateTo({ url: '../../pages/strategy/index'});
    }else if(that.data.level == 2 || that.data.level == 4 || that.data.level == 3 || that.data.level == 5){
      wx.navigateTo({ url: '../../pages/goldStrategy/index'});
    }
  },
  myPoints:function(){
    wx.navigateTo({
      url: '../../pages/integralRules/index',
    })
  }
})