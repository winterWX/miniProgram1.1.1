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
    activeData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('1111111')
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
            that.setData({
                activeData : res.data.data,
                activeNum : sercode,
                bluPosse : (1000 / Number(res.data.data.integral)).toFixed(5)
            })
            that.secoreFun();
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  secoreFun:function(){
    let that = this;
    let activeNum = that.data.activeNum;
    that.setData({
      secoreNun :  (100 / Number(activeNum)).toFixed(5)
    })
  },
  // upgradeFun(e){
  //   let cardUpgrade =  e.target.dataset.card;
  // }
})