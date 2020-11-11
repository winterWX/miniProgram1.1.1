const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponDetail:{},
    copyCode: false,
    showLink: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that = this;
      let {id} = options;
      that.couponDetail(id);
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
  couponDetail:function(id){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/tier/coupon/detail?id='+ id,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token,
        "native-app": "mini"
      },
      success: function (res) {
        if (res.data.code == 200) {
            res.data.data.effectiveDateTime = that.cardDayShow(res.data.data.effectiveDateTime);
            res.data.data.expiryTime = that.cardDayShow(res.data.data.expiryTime);
            that.setData({couponDetail: res.data.data});
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
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
      data: that.data.couponDetail.code,
      success (res) {
        wx.getClipboardData({
          success (res) {
              wx.showToast({
                title: '已复制'
              });
              console.log('res.data',res.data)    // data
          }
        })
      }
    })
  },
  handleFell:function(){
     let that = this;
     that.setData({showLink :true})
  }
})