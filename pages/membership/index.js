const app = getApp();
Page({
  data: {
    nickName : '',
    showCarkBlock:false,
    showTip : false,
    errorTip:false,
    errorTipThree:false,
    errorSeconeTip:false,
    tierCode:{}
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
    if(e.detail.value === ''){
        this.setData({showTip : false,errorTip:false,errorTipThree : false, errorSeconeTip:false});
    }
  },
  submitHnadle:function(){
    if (!this.data.nickName) {
        return;
    }else{
      if(/^(?=.*[A-Z])(?=.*[0-9])[A-Z-0-9]{2,}$/.test(this.data.nickName)){
          this.setData({showTip : false});
          this.membershipCode();
      }else{
            this.setData({showTip : true, errorTip : false, errorTipThree : false, errorSeconeTip:false});
      }
    }
  },
  nameChangeFocus:function(e){
      this.setData({showTip:false});
      console.log('e foe',e);
  },
  membershipCode:function(){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/tier/code',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token,
        "native-app": "mini"
      },
      data:{
        "membershipCode": this.data.nickName
      },
      success: function (res) {
        console.log('会员升级返回的内容==',res.data.data)
        if (res.data.code === 200) {
            that.setData({tierCode: res.data.data});
            that.setData({showCarkBlock: true, nickName : ''});
         }else if(res.data.code === 100804){
            that.setData({errorTip:true, errorTipThree : false, showTip:false, errorSeconeTip:false});
         }else if(res.data.code === 100802){
            that.setData({errorTipThree:true, errorTip : false, showTip:false, errorSeconeTip:false});
         }else if(res.data.code === 100803){
          that.setData({errorSeconeTip:true, errorTipThree:false, errorTip : false, showTip:false});
       }
      },
      fail: function (res) {
        console.log('.........fail..........',res);
        wx.showToast({
          title: '服务繁忙， 请稍后重试。',
          icon: 'loading'
        })
      }
    })
  },
  closeBlock:function(){
    this.setData({ showCarkBlock:true })
  },
  bindEmail:function(){
    wx.navigateTo({
      url: '../../pages/silverDetail/index',
    })
  },
  //查看优惠券
  myCouponsFun:function(){
    wx.navigateTo({
      url: '../../pages/myCoupons/index',
    })
  }
})