const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     friendList:[
       {touxiang:'../../image/addFriend/rectangle@2x.png',name:'王大锤',flg:false},
       {touxiang:'../../image/addFriend/rectangle@2x.png',name:'猪八戒',flg:true}
     ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.newFriendList();
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
  }
})