const app = getApp();
const userLogin = require('../../utils/userLogin.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
     isLogin: 0, //0还未授权获取用户信息，1已经授权获取用户信息，2已经授权获取电话号码，3是已经登录
     friendList:[],
     listHiden: false,
     userInfoData:{},
     avatarObjList: [
      {
        url:  app.globalData.imagesUrl + '/images/icon/icon-laoshu.png',
        id: 1
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconNiu.png',
        id: 2
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconLaohu.png',
        id: 3
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconTuzi.png',
        id: 4
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconLong.png',
        id: 5
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconShe.png',
        id: 6
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconMa.png',
        id: 7
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconYang.png',
        id: 8
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconHouzi.png',
        id: 9
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconJi.png',
        id: 10
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconGou.png',
        id: 11
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconZhu.png',
        id: 12
      },
      {
        url: app.globalData.imagesUrl + '/images/pagePng/icon-defult-touxiang.png',
        id: 13
      }, 
    ],
    friendFlg:false,
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
    }else if(options.addSuccess === 'addSuccess'){
        wx.showToast({
          title: '添加成功',
          icon: 'succes',  
          duration: 1500
        });
        this.newFriendList();
        this.setData( {listHiden:true} );
    }else{
        this.newFriendList();
        this.setData( {listHiden:true} );
        console.log('刷新功能');
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
    let that = this;
    wx.showNavigationBarLoading();         //在当前页面显示导航条加载动画
    that.newFriendList();
    setTimeout(function(){
        wx.hideNavigationBarLoading();     //在当前页面隐藏导航条加载动画
        wx.stopPullDownRefresh();          //停止下拉动作
    },1000)
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
          if(res.data.code === 200){
            let friendList = that.arryFriend(res.data.data);
            that.setData({ friendList : friendList});
          }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  addNewBtn:function(option){
    var that = this;
    let arrayNum = option.currentTarget.dataset.index;
    wx.request({
      url: app.globalData.baseUrl +'/remote/friend/accept',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      data:{
        uid: that.data.friendList[arrayNum].uid
      },
      success: function (res) {
          if(res.data.code == 200){
              let clickList = [];
              that.data.friendList.forEach((element,index) => {
                 if(index === arrayNum){
                    element.showFlg = true;
                    clickList.push(element);
                 }else{
                    clickList.push(element);
                 }
              });
              that.setData({ friendList: clickList });
              wx.showToast({
                title: '添加成功',
                icon: 'succes',  
                duration: 1500
              });
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
          that.data.isLogin = result.isLoginState;
          app.globalData.loginSuccess = result.isLoginState;
          app.globalData.userInfo = result.newUserInfo;
          app.globalData.userInfoDetail = result.newUserInfo;
        },e.detail,that.data.isLogin)
    }
  },
  arryFriend:function(allData){
    let lastArryData = allData.map( item =>{
        return {
          avatar: this.avatarSelect(item.avatar,item.avatarUrl),
          nickname: item.nickname,
          uid: item.uid,
          showFlg: false
        }
    })
    console.log("lastArryData+=====",lastArryData);
    return lastArryData;
},
avatarSelect:function(avatar,avatarUrl){
    if(avatar !==''){
        return this.data.avatarObjList[Number(avatar)-Number(1)].url;
    }else if(avatar ==='' && avatarUrl !==''){
        return avatarUrl;
    }else{
        return this.data.avatarObjList[12].url;
    }
 }

})