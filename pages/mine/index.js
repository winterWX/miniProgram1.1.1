const app = getApp();
const util = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rstProdu: 'rstProdu',
    btnHidden: 'btnHidden',
    complete: false,
    active: 4,
    runData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMyprofileInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let complete = wx.getStorageSync('complete');
    this.setData({
      complete
    })
    this.setData({
      active: 4
    })
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
  healthPage: function () {
    if (app.globalData.loginSuccess && app.globalData.isWeRunSteps) {
      let that = this;
      wx.navigateTo({
        url: '../../pages/healthPage/index?id=' + that.data.rstProdu
      })
    } else {
      this.getWeRunStepsData();
    }
  },
  sendFriend: function () {
    wx.navigateTo({
      url: '../../pages/recommend/index'
    })
  },
  profilePage: function () {
    wx.navigateTo({
      url: '../../pages/profile/index'
    })
  },
  settingPage: function () {
    wx.navigateTo({
      url: '../../pages/setting/index'
    })
  },
  getMyprofileInfo: function () {
  },
  getWeRunStepsData: function () {
    let that = this;
    wx.login({
      success: (res) => {
            console.log('code----',res.code);
            wx.getWeRunData({
              success(resRun) {
                const encryptedData = resRun
                console.info(resRun);
                wx.request({
                  url: app.globalData.baseUrl + '/remote/oauth/mini/getEncryptedData',
                  method: 'GET', 
                  header: {
                    'Content-Type': 'application/json',
                    "token": app.globalData.token
                  },
                  data: {
                    encryptedData: resRun.encryptedData,
                    iv: resRun.iv,
                    sessionkey : app.globalData.userInfo.session_key
                  },
                  success: function (resDecrypt) {
                    //let runData = resDecrypt.data.data;
                    let runData = JSON.parse(resDecrypt.data.data); 
                    if (runData.stepInfoList.length > 0)
                    {
                      runData.stepInfoList = runData.stepInfoList.reverse()
                      for (var i in runData.stepInfoList)
                      {
                        runData.stepInfoList[i].date = util.formatTime(new Date(runData.stepInfoList[i].timestamp*1000)).split(' ')[0]
                      }
                      that.setData({ runData: runData.stepInfoList });
                      app.globalData.runData = runData.stepInfoList;
                      console.log('1212121212',that.data.runData);
                    }
                    //授权成功跳转
                    app.globalData.isWeRunSteps = true;
                    wx.navigateTo({
                      url: '../../pages/healthPage/index?id=' + that.data.rstProdu
                    })
                    //记录领取积分
                    that.getintegral();  
                  },
                  fail: function () {
                        wx.navigateTo({
                          url: '../../pages/healthPage/index?flg=' + that.data.btnHidden
                        })
                  }
                });
              }
            })
        }
    })
  },
  getintegral: function () {
    wx.request({
      method: 'GET',
      url: app.globalData.baseUrl + '/remote/integral/stepAuth',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token
      },
      success: (res) => {
        if (res.data.code === 200) {
            app.healthStep.integralRecord = true  //授权已领
        }
      }
    })
  },

})