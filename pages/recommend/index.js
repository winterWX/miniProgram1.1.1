const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCanDraw: false,
    userInfoData:{},
    invitData:{},
    recommendFlg: false,
    copyNum:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this;
    that.forShareNum();
    that.recommendNum();
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

  copyNumFun:function(){
    let that = this;
      that.setData({
        copyNum: true
      })
      wx.showToast({
        title: '复制成功',
        icon: 'success',
        duration: 2000
      })
  },
  createShareImage:function() {
    this.setData({
      isCanDraw: !this.data.isCanDraw
    })
  },
  //邀请码  
  recommendNum: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/invite/invitationcode',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
          if(res.data.data !== null){
              that.setData({  
                invitData: res.data.data
              })
              console.log('res.data.data外', res.data.data)
              //添加邀请码到 userInfo
              app.globalData.invitationCode = res.data.data.invitationCode;
              if(res.data.data.invitationList.length > 0){
                  console.log('res.data.data里', res.data.data)
                  res.data.data.invitationList.forEach( v => {
                      let reg = /^(\d{3})\d{4}(\d{4})$/;
                      v.phoneNumber = v.phoneNumber.replace(reg, "$1****$2");
                  })
                  res.data.data.personNum = res.data.data.invitationList.length;
                  that.setData({  
                    invitData: res.data.data
                  })
                  console.log('invitData',that.data.invitData)
                  that.setData({  
                    recommendFlg: true
                  })
              }else{
                  that.setData({  
                    recommendFlg: false
                  })
              }
          }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  //小程序码
  forShareNum: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/wxQrCode/generateQrCode',
      method: "POST",
      data:{
        path: '',
        width: 88
      },
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
          // if(res.data.data !==null){

          // }
          console.log('res',res);
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    this.setData({
        userInfoData :app.globalData.userInfo
    })
    //code 码
    this.data.userInfoData.invitationCode = this.data.invitData.invitationCode;
    let userInfoData = JSON.stringify(this.data.userInfoData);
    console.log('app.globalData.userInfo分享时的参数', userInfoData)
    let shareObj = {
　　　　title: "邀请好友注册领好礼",
　　　　path: '/pages/sharedPage/index?userInfoData='+ userInfoData,
        imageUrl: '/images/recommend/img@2x.png',
　　}
　　// 来自页面内的按钮的转发
　　if (options.from == 'button') {
　　　　 shareObj.path = '/pages/sharedPage/index?userInfoData='+ userInfoData;
　　}
　　return shareObj;
},
})