import { wxAjax } from "../../utils/util";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: 0,
    bannerUrl: '',
    title: '',
    content: '',
    questionNumber: 0,
    participated: false,
    id: '',
    isEnds: 1,
    reward: 0
  },
  getUserInfo(e) { //获取用户信息
    if (e.detail.userInfo) {
      this.onLogin(e.detail)
    }
  },
  onLogin(data) { //登录
    wx.login({
      success: (res) => {
        if (res.code) {
          //发起网络请求
          this.setData({ code: res.code })
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
  checkAuthorization() {
    wx.getSetting({
      success: (setingres) => {
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
                  that.setData({
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
  userLogin(data) {
    let that = this;
    const params = {
      code: this.data.code,
      encrypteData: data.encryptedData,
      iv: data.iv
    }
    let url = app.globalData.baseUrl + '/remote/oauth/minipro/login';
    wxAjax('POST', url, params).then(res => {
      if (res.data.code === 200) {
        app.globalData.userInfo = res.data.data
        that.setData({
          isLogin: 1
        })
        let urlBase = '../healthKnowledge/index/#' + that.data.id;
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
    })
  },
  goToAnswer: function() {
    let { id, title } = this.data;
    wx.navigateTo({
      url: '../answer/index?id=' + id + '&title=' + title,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options);
    let { id, goodsId, title=''} = options;
    let activityId = id || goodsId;
    wx.setNavigationBarTitle({ title });
    this.setData({id: activityId, title});
    this.getQuestion(activityId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let isLogin = app.globalData.isLogin === 3 ? 1 : 0;
    this.setData({isLogin});
    console.log('isLogin',isLogin);
  },
  goResult: function() {
    let { id, title } = this.data;
    wx.navigateTo({
      url: '../changeQAResult/index?id=' + id + '&title=' + title,
    })
  },
  getQuestion: function(id) {
    let that = this;
    let token = app.globalData.token || '';
    let url = app.globalData.baseUrl + '/remote/health/quiz/desc?id=' + id;
    wxAjax('GET', url).then(res => {
      if(res.data.code === 200) {
        let { bannerUrl, title, content, questionNumber, quizResult, isEnds, reward } = res.data.data;
        //let info = content.replace(/<[^>]+>/g,"");
        let participated = quizResult !== null;
        wx.setNavigationBarTitle({ title });
        that.setData({
          bannerUrl,
          title,
          content: content,
          questionNumber,
          participated,
          isEnds,
          reward
        })
        
      }
    })
  }
})