const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        url: app.globalData.imagesUrl + '/images/icon/icon-defult-touxiang.png',
        id: 13
      }, 
    ],
    showArray:[],
    friendArrayData:[],
    noArray:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // that.setData({ noArray:true });
    that.hasAddFriend();
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
  onChange:function(event){
    let that = this;
    let inputVal = event.detail;
    let friendData = that.data.friendArrayData.filter(item => item.mobile.indexOf(inputVal) > -1 );
    that.setData({showArray: inputVal === '' ? [] : friendData});
  },
  onCancel:function(){
      wx.navigateBack({
        url: '../addFriend/index',
      })
  },
  hasAddFriend:function(){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/friend',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token,
        "native-app": "mini"
      },
      success: function (res) {
          if(res.data.code === 200){
            let friendArrayData = that.arryFriend(res.data.data);
            that.setData({friendArrayData:friendArrayData})
          }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  arryFriend:function(allData){
    let lastArryData = allData.map((item,index)=>{
        return {
          avatar: this.avatarSelect(item.avatar,item.avatarUrl),
          nickname: item.nickname,
          mobile: item.mobile
        }
    })
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