const app = getApp();
const userLogin = require('../../utils/userLogin.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
     isLogin: 0, //0还未授权获取用户信息，1已经授权获取用户信息，2已经授权获取电话号码，3是已经登录
     friendList:[
       {touxiang:'http://106.54.73.125:8104/images/miniprogram/images/addFriend/rectangle@2x.png',name:'王大锤',flg:false},
       {touxiang:'http://106.54.73.125:8104/images/miniprogram/images/addFriend/rectangle@2x.png',name:'猪八戒',flg:true}
     ],
     listHiden: false,
     userInfoData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.userInfoData){
      let userInfoData = JSON.parse(options.userInfoData);
      console.log('来自邀请人的数据', userInfoData);
      app.globalData.invitationCode = userInfoData.invitationCode;
      this.setData({
        userInfoData : userInfoData
      })
    }else{
      this.newFriendList();
      this.setData({listHiden:true})
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
  onShareAppMessage: function () {},
  newFriendList:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/friend/apply',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
          if(res.data.code !==null){
            console.log('res',res);
          }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  addNewBtn:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/friend/accept',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      data:{
        uid:''
      },
      success: function (res) {
          if(res.data.code == 200){
              wx.showToast({
                title: '添加成功',
              })
              this.newFriendList();
          }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  getUserInfo:function(e) { //获取用户信息
    let that = this;
    if (e.detail.userInfo) {
        userLogin.onLogin(function(result){
          console.log('result=========',result);
          that.data.isLogin = result.isLoginState;
          app.globalData.loginSuccess = result.isLoginState;
          app.globalData.userInfo = result.newUserInfo;
        },e.detail,that.data.isLogin)
    }
  }
})