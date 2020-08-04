const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: 0, //0还未授权获取用户信息，1已经授权获取用户信息，2已经授权获取电话号码，3是已经登录
    bottomFlaotShow: true,
    contentAll:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let that = this;
     that.tokenOnLoad();
     console.log('options',options)
     that.articleDetail(options.goodsId);
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
  tokenOnLoad:function(){
    var that = this;
    if (app.globalData.token !== '') {
      that.setData({
        isLogin: 3
      })
    } else if (app.globalData.userInfo !== null) {
      that.setData({
        isLogin: 1
      })
    }
    if (that.data.isLogin === 3){3
      that.setData({
        bottomFlaotShow: false   //是否显示登录按钮  true为显示，false 为不显示
      })
    }
  },
  articleDetail:function(listNum){
    var that = this;
    wx.request({
    url: app.globalData.baseUrl + '/remote/article/collection/detail?id='+listNum,
    method: "GET",
    header:{
      'Content-Type':'application/json',
      "token": app.globalData.token
    },
    success: function (res) {
      if(res.data.data !== null){
          res.data.data.createTime = that.timestampToTime(res.data.data.createTime);
          var deleteString = '';
          String.prototype.replaceAll = function (FindText, RepText) {
            return this.replace(new RegExp(FindText, "g"), RepText);
          }
          deleteString = res.data.data.tags.replaceAll('#', '');
          res.data.data.tags = deleteString;
          that.setData({
            contentAll : res.data.data
          })
          console.log('dadtatdadad',that.data.contentAll)
      }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
  })
  },
checkAuthorization() { //检测是否已经授权      
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
    console.log(e)
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
          app.globalData.userInfo = res.data.data
          this.setData({
            isLogin: 1
          })
          wx.navigateTo({
            url: '../login/index?url=' + '../index/index',
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
  timestampToTime: function (timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + '，' + h + m;
  }
})