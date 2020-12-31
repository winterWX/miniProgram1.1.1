
import { wxAjax } from "../../utils/util";
const app = getApp();
const userLogin = require('../../utils/userLogin.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfoData:{},
    isLogin: 0,
    redirectToUrl:'pageTag', //新用户跳转的标记
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfoData = JSON.parse(options.userInfoData);
    app.globalData.invitationCode = userInfoData.invitationCode;
    this.setData({ userInfoData : userInfoData })
  },
  
  getUserInfo(e) { //获取用户信息
    let that = this;
    that.selectComponent("#loading").show();
    if (e.detail.userInfo) {
        userLogin.onLogin(function(result){
          that.data.isLogin = result.isLoginState;
          app.globalData.loginSuccess = result.isLoginState;
          app.globalData.userInfo = result.newUserInfo;
          app.globalData.userInfoDetail = result.newUserInfo;
          that.selectComponent("#loading").hide();
        },e.detail,that.data.isLogin,that.data.redirectToUrl)
    }
  },
})