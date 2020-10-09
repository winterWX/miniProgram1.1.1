const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    secore:[],
    secoreNun:0,
    activeNum:0,
    bluPosse:0,
    activeData:{},
    LockFlg : true,
    indicatorColor:'#EDEDED',
    indicatorActive:"#929292",
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    windowWidth: wx.getSystemInfoSync().windowWidth*2,
    couponTypeText:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tierMytier();
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
  tierMytier:function(){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/tier/mytier',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 200) {
            let sercode = res.data.data.mileStones.length;
            let couponType = res.data.data.tierInfo.couponType;
            // that.setData({couponTypeText: couponType === 1 ? '折扣券' : '现金券'});
            that.setData({
                activeData : res.data.data,
                activeNum : sercode,
                bluPosse : that.bluPosse(sercode,res.data.data),
                couponTypeText: couponType === 1 ? '折扣券' : '现金券'
            })
            that.secoreFun();
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  bluPosse:function(sercode,data){
     let bluNum = (100 / Number(data.mileStones[sercode-1].targetIntegral));
     return (Number(bluNum) * Number(data.integral)).toFixed(1);
  },
  secoreFun:function(){
    let that = this;
    let activeNum = that.data.activeNum;
    that.setData({
      secoreNun :  (100 / Number(activeNum)).toFixed(5)
    })
  },
  receivedFun:function(e){
    let that = this;
    let idCode = e.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.baseUrl + '/remote/tier/reward/receive?id='+ idCode,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 200) {
            that.tierMytier();
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  parentCallBack:function(event){
    let that = this;
    if (event.detail.LockLevel === 2){
        that.setData({ silverLevel: true, glodLevel: false,LockFlg: false});
    }else if(event.detail.LockLevel === 3){
        that.setData({ glodLevel: true,silverLevel: false,LockFlg:false });
    }else{
        that.setData({ silverLevel: false, glodLevel:false,LockFlg: true});
    }
  }
})