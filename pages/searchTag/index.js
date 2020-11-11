let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight : wx.getSystemInfoSync().windowHeight*2
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
  onChange: function (e){
    let that = this;
    var inputVal = e.detail.replace(/^\s+|\s+$/g, "");
    wx.request({
      url: app.globalData.baseUrl + '/remote/article/filter/query',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token,
        "native-app": "mini"
      },
      data:{
        currentPage: 1,
        pageSize: 10,
        value : inputVal
      },
      success: function (res) {
        if(res.data.code === 200){
          res.data.data = res.data.data.map(item=>{
               return {
                  ...item,
                  inputtime : item.inputtime ? that.timestampToTime(item.inputtime):''
               }
          })
          that.setData({listData:res.data.data})
        }
      },
      fail: function (res) {
          console.log('---------------');
      }
    })
  },
  onSearch:function(){},
  onCancel:function(){
      wx.navigateBack({
        url: '../../pages/HealthInformation/index',
      })
  },
  listClick:function(e){
      let goodsId = e.currentTarget.dataset.itemid;      
      wx.navigateTo({                                 
        url: '../../pages/HealthInforDetails/index?goodsId='+ goodsId      
      })
  },
  timestampToTime :function (timestamp){
    let date = new Date(timestamp * 1000);  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return D + M + Y + '，' + h + m;
},
})