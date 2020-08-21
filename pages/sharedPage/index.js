
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoData:{},
    isLogin: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfoData = JSON.parse(options.userInfoData);
    console.log('来自转发的数据', userInfoData);
    app.globalData.invitationCode = userInfoData.invitationCode;
    this.setData({
      userInfoData : userInfoData
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
  onShareAppMessage: function () {

  },
  //检测是否已经授权  
  checkAuthorization() {
    wx.getSetting({
      success: (setingres) => {
        wx.hideLoading()
        if (setingres.authSetting['scope.userInfo']) { //已经授权获取用户信息             
          wx.getUserInfo({
            success: (res) => {
              this.userLogin(res)
            },
            fail: () => {
              wx.showModal({
                showCancel: false,
                content: '获取用户信息失败,请重新点击底部菜单',
                success: (res) => {
                  this.setData({
                    isLogin: 0
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  onLogin(data) { //登录
    wx.showLoading({
      title: 'loading...',
    })
    wx.login({
      success: (res) => {
        wx.hideLoading()
        console.log("res", res)
        if (res.code) {
          //发起网络请求
          this.setData({
            code: res.code
          })
          if (this.data.isLogin == 0) {
            this.checkAuthorization()
          } else if (this.data.isLogin == 1) {
            this.userLogin(data)
          }
          //标记登录成功
          app.globalData.loginSuccess = true;
        }
      },
      fail: function (res) {
        wx.showModal({
          showCancel: false,
          content: '登录失败',
          success: (res) => {

          }
        })
      }
    })
  },
  getUserInfo(e) { //获取用户信息
    console.log('获取用户信息',  e)
    if (e.detail.userInfo) {
      this.onLogin(e.detail)
    }
  },
  userLogin(data) {
    wx.showLoading({
      title: 'loading...',
    })
    const parms = {
      code: this.data.code,
      encrypteData: data.encryptedData,
      iv: data.iv
    }
    wx.request({
      method: 'post',
      url: app.globalData.baseUrl + '/remote/oauth/minipro/login',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      data: parms,
      success: (res) => {
        if (res.data.code === 200) {
          app.globalData.userInfo = res.data.data;
          app.globalData.userInfoDetail = data.userInfo || res.data.data;
          this.setData({
            isLogin: 1
          })
          //let successLogin = true;  //新用户注册成功的标志
          let urlBase = '../index/index';
          wx.redirectTo({
            url: '../login/index?url=' + urlBase,
          })
        } else {
          wx.showModal({
            showCancel: false,
            content: res.message,
            success: (res) => { }
          })
        }
        wx.hideLoading()
      }
    })

  },
})