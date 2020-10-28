let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    copyWriting:[],
    enjoyCopywriting:[],
    tierInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let levelParam = JSON.parse(options.levelParam)
     this.initPage(levelParam);
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
  initPage: function (levelParam){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/copywriting/findMemberCopy',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data:{
          // flag : levelParam.flag,
          flag : 2,
          level : levelParam.level,
      },
      success: function (res) {
        if(res.data.code === 200){
          that.setData({
              copyWriting : res.data.data.copyWriting,
              enjoyCopywriting : res.data.data.enjoyCopywriting,
              tierInfo : res.data.data.tierInfo
          })
        }
      },
      fail: function (res) {
          console.log('---------------');
      }
    })
  },
  btnNetoPage:function(){
    wx.navigateTo({
      url: '../../pages/silverDetail/index',
    })
  }
})