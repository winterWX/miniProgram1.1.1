let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    detail: {},
    width: 0,
    isLogin: 0,
    code: '',
    isJoin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {id='', title='活动详情', goodsId=''} = options;
    let activityId = id || goodsId;
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({activityId: id});
    this.getActivityDetail(activityId);
    if (goodsId) {
      this.joinActivity(goodsId);
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
  getActivityDetail: function(id) {
    let that = this;
    wx.showToast({title: '加载中', icon: 'loading'});
    wx.request({
      url: app.globalData.baseUrl + '/remote/myactivity/detail/' + id,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.code == 200) {
          let detail = {
            ...res.data.data,
            content: res.data.data.content.replace(/<[^>]+>/g, ''),
            ruledescription: res.data.data.ruledescription.replace(/<[^>]+>/g, '')
          }
          that.setData({detail});
        }
      },
      fail: function (res) {
        wx.hideToast();
      }
    })
  },
  userLogin(data) {
    let that = this;
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
          console.log('res:' + res)
          app.globalData.userInfo = res.data.data
          this.setData({
            isLogin: 1
          })
          let urlBase = '../activityDetail/index/#' + that.data.activityId;
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
                content: '获取用户信息失败,请重试',
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
          content: '登录失败'
        })
      }
    })
  },
  getUserInfo(e) { //获取用户信息
    if (e.detail.userInfo) {
      this.onLogin(e.detail)
    }
  },
  joinActivity: function(id) {
    let that = this;
    wx.showToast({title: '加载中', icon: 'loading'});
    wx.request({
      url: app.globalData.baseUrl + '/remote/myactivity/add',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data: {
        activityId: id
      },
      success: function (res) {
        wx.hideToast();
        if (res.data.code == 200) {
          that.setData({isJoin: true})
        }
      },
      fail: function (res) {
        wx.hideToast();
      }
    });
  }
})