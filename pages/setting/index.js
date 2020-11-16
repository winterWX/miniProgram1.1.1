const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      active: 4
    })
  },
  // 退出登录
  loginOut: function() {
    wx.request({
      url: app.globalData.baseUrl + '/remote/loginOut',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token,
        "native-app": "mini"
      },
      data:{
        device: 2
      },
      success: function (res) {
        if (res.data.code == 200) {
            app.globalData.isLogin = 0;
            app.globalData.token = '';
            app.globalData.userInfo = null;
            app.globalData.loginSuccess = false;
            wx.navigateTo({
              url: '../index/index'
            })
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  }
})