const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.hasAddFriend();
     this.inviteCode();
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
  onShareAppMessage: function (options) {
    app.globalData.userInfo.invitationCode = this.data.invitData.invitationCode;
    //let userInfoAllData = app.globalData.userInfo;
    let userInfoData = JSON.stringify(app.globalData.userInfo);
    let shareObj = {
  　　　　title: "邀请好友注册领好礼",
  　　　　path: "/pages/sharedPage/index?userInfoData="+ userInfoData,
         imageUrl: "/image/addFriend/image@2x.png",
  　　}
  　　// 来自页面内的按钮的转发
  　　if (options.from == "button") {
    　　　　return shareObj;
  　　}
  　　return shareObj;
  },
  newFriend:function(){
    wx.navigateTo({
      url: '../../pages/newFriend/index',
    })
  },
  //邀请码  
  inviteCode: function () {
      var that = this;
      wx.request({
        url: app.globalData.baseUrl + '/remote/invite/invitationcode',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          'token': app.globalData.token
        },
        success: function (res) {
            if(res.data.data === 200){
                if(res.data.data.invitationList.length > 0){
                    res.data.data.invitationList.forEach( v => {
                        let reg = /^(\d{3})\d{4}(\d{4})$/;
                        v.phoneNumber = v.phoneNumber.replace(reg, "$1****$2");
                    })
                    res.data.data.personNum = res.data.data.invitationList.length;
                    that.setData({  
                      invitData: res.data.data
                    })
                    console.log('invitData',that.data.invitData)
                }
            }
        },
        fail: function (res) {
          console.log('.........fail..........');
        }
      })
  },
  hasAddFriend:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/friend',
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
  }
})