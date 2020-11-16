const app = getApp();
Page({
  data: {
    scrollH:300,    
    detail: {
      continuousComplianceDays: 0,
      totalIntegral:0,
      maxContinuousDays:0
    },
    history:{},
    year: new Date().getFullYear(),
    num:0,
    yeseterDate: '',
    isReceive: false,
    isLoad:true,
    dayTime: '',
    forceNum:false,
    integralData:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.dayTimeFun();
    this.getTopHeight();
    this.isReceiveFun();
    this.historyList();
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
  formatDate(value){
    let date = new Date(value * 1000);
    let y = date.getFullYear();  // 年
    let MM = date.getMonth() + 1; // 月   
    let d = date.getDate();  // 日
    return MM+'月'+d+'日'
  },
  dayTimeFun(){
    let dayTime = new Date();
    let MM = dayTime.getMonth() + 1; // 月   
    let d = dayTime.getDate();  // 日
    this.setData({ dayTime : MM+'月'+d+'日'});
  },
  getTopHeight(){
    wx.createSelectorQuery().in(this).select('.headFix').boundingClientRect((rects) => {    
      this.setData({
        scrollH: wx.getSystemInfoSync().windowHeight - rects.height-30
      })
    }).exec()
  },
  bindscrolltolower(e){
    if (this.data.isLoad == true){
             this.setData({
           isLoad:false
         })
         this.historyList()
   }
  },
  historyList() {//领取积分      
    // wx.showLoading({
    //   title: 'loading...',
    // })
    wx.request({
      method: 'post',
      url: app.globalData.baseUrl + '/remote/challenge/historyList',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token,
        "native-app": "mini"
      },
      data: {
        currentTime: Date.parse(new Date()) / 1000,
        year: this.data.year
      },
      success: (res) => {
        if (res.data.code === 200) {                 
          if (this.data.year == new Date().getFullYear()){
            this.setData({
              detail: {
                continuousComplianceDays: res.data.data.continuousComplianceDays,
                totalIntegral: res.data.data.totalIntegral,
                maxContinuousDays: res.data.data.maxContinuousDays                
              }
            })
          }
          const data = res.data.data.monthsList
          for (var i = 0; i < data.length; i++){
            for (var k = 0; k < data[i].historyList.length; k++) {
              data[i].historyList[k].date = this.formatDate(data[i].historyList[k].createTime)
            }
          }
          
          var history=this.data.history
          history[this.data.year] = data         
          this.setData({
            history: history,
            year:this.data.year-1,
            isLoad:true
          })
        } else {
          wx.showModal({
            showCancel: false,
            content: res.data.message,
            success: (res) => { }
          })
        }
        wx.hideLoading()
      }
    })


  },
  isReceiveFun(){
    //当天凌晨的时间戳
    var h1 = new Date(new Date().setHours(0, 0, 0, 0)) / 1000
    //昨天的时间戳
    var h2=h1 - 24 * 60 * 60
    console.log(h2)
    var yeseterDate = this.formatDate(h2)
    var isReceive=false 
       
    if (Date.parse(new Date()) / 1000 < h1 + 24 * 60 * 60) {      
      isReceive=true
    }
    this.setData({
      yeseterDate: yeseterDate,
      isReceive: isReceive
    })
    console.log('yeseterDate',this.data.yeseterDate);
  },
  yesterdayIntegral(e) {  //补领积分  
    const key = e.currentTarget.dataset.key; 
    const i = e.currentTarget.dataset.ind;   
    const index = e.currentTarget.dataset.index;  
    const item = e.currentTarget.dataset.item;
    
    wx.showLoading({
      title: 'loading...',
    })
    const parms = {
      challengeId:  item.id,
      receivePoints: '10'
    }
    wx.request({
      method: 'post',
      url: app.globalData.baseUrl + '/remote/challenge/makeup',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token,
        "native-app": "mini"
      },
      data: parms,
      success: (res) => {
        wx.hideLoading()
        if (res.data.code === 200) {
          var history = this.data.history
          history[key][i].historyList[index].receiveStatus = 1;
          history[key][i].historyList[index].integral = 10;
          this.setData({ integralData : 10 });
          this.setData({forceNum : true, history: history });
          this.onLoad();
        } else {
          console.log('fail--------')
          wx.showModal({
            showCancel: false,
            content: res.message,
            success: (res) => { }
          })
        }       
      }
    })
  },
  todayIntegral(e){  //领取积分
    const key = e.currentTarget.dataset.key; 
    const i = e.currentTarget.dataset.ind;
    const index = e.currentTarget.dataset.index; 
    const item = e.currentTarget.dataset.item;
    
    wx.showLoading({
      title: 'loading...',
    })       
    wx.request({
      method: 'get',
      url: app.globalData.baseUrl + '/remote/today/receiveIntegral',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token,
        "native-app": "mini"
      },        
      success: (res) => {
        if (res.data.code === 200) {
            var history = this.data.history
            history[key][i].historyList[index].receiveStatus = 1;
            history[key][i].historyList[index].integral = 10;
            this.setData({forceNum : true, integralData : 10 });
            this.onLoad();
        } else {
            wx.showModal({
              showCancel: false,
              content: res.data.message,
              success: (res) => { }
            })
        }
        wx.hideLoading()
      }
    })  
  }
})