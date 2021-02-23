const app = getApp();
const util = require('../../utils/util');
Page({
  data: {
      couponDetailObj:{},
      copyCode: false,
      showLink: false,
      levelNum: 0,
      imagesUrl: app.globalData.imagesUrl,
      thirdUrls:'',
      modelShow: false,
      showNumber: 0,
      backHight:  0 ,  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
      let {id, flag = null, limit = null} = options;
      that.couponDetail(id, flag, limit);
      that.userLevel();
      that.setData({
        backHight: wx.getSystemInfoSync().windowHeight*2 - 750  + 'rpx'
      })
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
  onShareAppMessage: function () {},

  couponDetail:function(id, flag, limit){
    let that = this;
    let data = {};
    let url = flag ? app.globalData.baseUrl + '/remote/tier/coupon/milestone/detail?id='+ id : app.globalData.baseUrl + '/remote/tier/coupon/detail?id='+ id;
    if (limit) {
      url = app.globalData.baseUrl + '/remote/coupon/mainDetail';
      data.couponMainId = id;
    }
    let method = 'GET';
    that.selectComponent("#loading").show();
    util.wxAjax(method,url, data).then(res =>{
        if (res.data.code == 200 && res.data.data !== null) {
            res.data.data.effectiveDateTime = that.cardDayShow(res.data.data.effectiveDateTime);
            res.data.data.expiryTime = that.cardDayShow(res.data.data.expiryTime);
            that.setData({couponDetailObj: Object.assign({},res.data.data)});
            console.log('res.data.data===',that.data.couponDetailObj);
        }
        that.selectComponent("#loading").hide();
    })
  },

  cardDayShow:function(value){
    const date = new Date(value * 1000); 
    const Y = date.getFullYear() + '年';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
    return  Y + M + D;
  },
  
  texteCopy:function(){
    let that = this;
    wx.setClipboardData({
      data: that.data.couponDetailObj.code,
      success (res) {
        wx.getClipboardData({
          success (res) {
              wx.showToast({
                title: '成功复制'
              });
          }
        })
      }
    })
  },

  artContinueBtn: function (event){
    let that = this;
    if (event.detail.artContinueBtn){
        that.setData({ modelShow: false, showLink: true });
    }
  },

  artCancelBtn: function (event){
    let that = this;
    if (event.detail.artCancelBtn){
        that.setData({ modelShow: false, showLink: false });
    }
  },

  
  handleFell:function(){
     let that = this;
     if(that.data.couponDetailObj.thirdPartyUrl === 'QHMS'){
        that.setData({ modelShow: true, showNumber: 3 });
     }else if(that.data.couponDetailObj.thirdPartyUrl !== 'QHMS' && that.data.couponDetailObj.thirdPartyUrl !== ''){
        that.setData({ showLink: true });
     } 
  },

  userLevel:function(){
    let that = this;
    let method = 'GET';
    let url = app.globalData.baseUrl +'/remote/homePage/userlevel';
    that.selectComponent("#loading").show();
    util.wxAjax(method,url).then(res =>{
      if (res.data.code === 200) {
          let level = res.data.data;
          let golider = 'https://www.qhms.com/promotion/olive2627.aspx';   // 金
          let solieder = 'https://www.qhms.com/promotion/olive6342.aspx';  // 银
          let brolider = 'https://www.qhms.com/promotion/olive2026.aspx';  // 铜
          that.setData({thirdUrls: (level == 3 || level == 5) ? golider : ((level == 2 || level == 4) ? solieder : brolider ) });
      }
      that.selectComponent("#loading").hide();
    })
  },
})