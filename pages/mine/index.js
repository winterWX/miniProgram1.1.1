const app = getApp();
const util = require('../../utils/util');
const authorizeRun = require('../../utils/authorizeRun.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allowTo: 'allowTo',
    refusedTo: 'refusedTo',  
    complete: false,
    active: 4,
    runData:[],
    isAppData: false,  //判断是不是app用户
    typeFlg:'',
    showDialog:false,
    windowHeight: wx.getSystemInfoSync().windowHeight *2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.checkIsAppUser();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let complete = wx.getStorageSync('complete');
    this.setData({
      complete,
      active: 4
    })
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
  healthPage: function () {
    let that = this;
    if(that.data.isAppData){
      that.carryAPPData();
    }else{
      if (app.globalData.loginSuccess && app.globalData.isWeRunSteps) {
        that.healthSccuss();
      } else {
        authorizeRun.getWxRunData(function(result){
            if(result.length > 0){
              //授权成功跳转获取步数
              app.globalData.runData = result;
              app.globalData.isWeRunSteps = true; //标志授权成功
              that.getQueryLatestime(result);
            }else{
              //拒绝授权
              that.setData({showDialog: true});
              //that.healthFail();
            }
        })
      }
    }
  },
  sendFriend: function () {
    wx.navigateTo({
      url: '../../pages/recommend/index'
    })
  },
  carryAPPData:function(){
    wx.navigateTo({
      url: '../../pages/healthPage/index?id=' + 'carryAPPData'
    })
  },
  healthSccuss:function(){
    let that = this;
    wx.navigateTo({
      url: '../../pages/healthPage/index?id=' + that.data.allowTo
    })
    app.healthStep.SynchronousData = true;  //每日健康页面不需要授权
  },
  healthFail:function(){
    let that = this;
    wx.navigateTo({
      url: '../../pages/healthPage/index?flg=' + that.data.refusedTo
    })
  },
  profilePage: function () {
    wx.navigateTo({
      url: '../../pages/profile/index'
    })
  },
  navigateMyActivity: function () {
    wx.navigateTo({
      url: '../../pages/myActivity/index'
    })
  },
  settingPage: function () {
    wx.navigateTo({
      url: '../../pages/setting/index'
    })
  },
  addFriend: function () {
    wx.navigateTo({
      url: '../../pages/addFriend/index'
    })
  },
  silverDetail: function () {
    wx.navigateTo({
      url: '../../pages/silverDetail/index'
    })
  },
  //最近上传数据时间查询(query- queryLatestime)|移动端
  getQueryLatestime: function (runData) {
      let that = this;
      wx.request({
        method: 'GET',
        url: app.globalData.baseUrl + '/remote/health/data/query/latestime',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        success: (res) => {
          if (res.data.code === 200) {
              //最后上传时间戳 和 当前时间戳进行比较
              let time = res.data.data;
              //let dayTime = parseInt(new Date().getTime() / 1000);
              const runArray = that.runArray(runData,time);
              that.getUploaddata(runArray);
          }
        }
      })
  },
  //运动数据同步上传
  getUploaddata: function (runData) {
    let that = this;
    wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/remote/health/data/uploaddata',
      header: {
        "Content-Type": "application/json;charset=UTF-8",
        "token": app.globalData.token
      },
      data:{
        bpm: 0,
        source :'string',
        type : 'MINIP',
        lastTime: parseInt(new Date().getTime() / 1000) + '',
        stepsDataModelList: runData,
      },
      success: (res) => {
        if (res.data.code === 200) {
            that.healthSccuss();
            console.log('数据同步成功')
        }
      }
    })
  },
checkIsAppUser:function(){
  let that = this;
  wx.request({
    method: 'GET',
    url: app.globalData.baseUrl + '/remote/health/data/ensure/user',
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "token": app.globalData.token
    },
    success: (res) => {
      if (res.data.code === 200) {
          // 2 app 用户，1 mini用户
          that.setData({
            isAppData: res.data.data === 2 ? true : false
          })
          //数据源
          app.healthStep.dataCource = res.data.data;
      }
    }
  })
},
runArray:function(array,lastTime){
    let that = this;
    let runDataArray = [];
    array.forEach((item)=>{
      runDataArray.push({
          endTime:  item.timestamp + '',
          startTime: item.timestamp + '' ,
          steps: item.step
        })
    })
    const indexs = runDataArray.findIndex(item =>{
      return util.timestampToTime(item.endTime) === util.timestampToTime(lastTime);
    })
    if(indexs > -1){
      return runDataArray.splice(0,indexs+1)
    }
    return runDataArray;
  },
  closeModal: function() {
    this.setData({showDialog: false});
    this.healthFail();
  },
  callback: function() {
    this.setData({showDialog: false});
  }
})