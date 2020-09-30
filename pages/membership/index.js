const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName : '',
    showTip : false,
    showCarkBlock:false
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
  nameChange:function(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  submitHnadle:function(){
    if (!this.data.nickName) {
        return;
    }else{
      if(/[A-Z0-9]/.test(this.data.nickName)){
        console.log('0000000000000000',this.data.nickName)
        this.setData({showTip : true})
     }else{
        this.setData({showTip : false})
        console.log('this.data.nickName',this.data.nickName);
     }
    }
    this.membershipCode();
  },
  membershipCode:function(){
    wx.request({
      url: app.globalData.baseUrl + '/remote/tier/code',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data:{
        "membershipCode": this.data.nickName
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            titel: '服务繁忙， 请稍后重试。',
            icon: 'loading'
          })
          wx.redirectTo({
            url: '../profile/index',
            success: function(res) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'success',
                  duration: 2000
                })
            }
          });
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
        wx.showToast({
          titel: '服务繁忙， 请稍后重试。',
          icon: 'loading'
        })
      }
    })
  },
  closeBlock:function(){
    this.setData({ showCarkBlock:true })
  }
})