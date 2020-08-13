// pages/login/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options+++', options);
    if (options.url.indexOf('/#') > -1) {
      let baseUrlNum = ''
      let startStr = options.url.substr(0, options.url.indexOf('/#'));
      let endStr = options.url.substr(options.url.indexOf('/#') + 2, options.url.length - 1);
      baseUrlNum = startStr + '?goodsId=' + endStr;
      console.log('baseUrlNum', baseUrlNum)
      this.setData({
        url: baseUrlNum
      })
    } else {
      this.setData({
        url: options.url
      })
    }
    console.log(options)
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
  phoneNumberLogin (data) {
    const parms = {
      encryptedData: data.encryptedData,
      iv: data.iv,
      openId: app.globalData.userInfo.openId,
    }
    wx.showLoading({
      title: 'loading...',
    })
    wx.request({
      method: 'post',
      url: app.globalData.baseUrl + '/remote/register/miniProgram/add',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      data: parms,
      success: (res) => {
        if (res.data.code === 200) {
          app.globalData.token = res.data.data.token
          wx.redirectTo({
            url: this.data.url,
            complete: () => {

            }
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
  getPhoneNumber (e) { //获取电话信息     
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      this.phoneNumberLogin(e.detail)
    } else {
      wx.redirectTo({
        url: '../index/index',
        complete: () => {

        }
      })
    }

  },
  stopLogin () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
})