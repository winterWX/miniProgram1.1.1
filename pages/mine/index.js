const app = getApp();
const util = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rstProdu: 'rstProdu',
    btnHidden: 'btnHidden',
    complete: false,
    active: 4,
    runData:[]
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
    this.getMyprofileInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let complete = wx.getStorageSync('complete');
    this.setData({
      complete
    })
    this.setData({
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
    if (app.globalData.loginSuccess && app.globalData.isWeRunSteps) {
      let that = this;
      wx.navigateTo({
        url: '../../pages/healthPage/index?id=' + that.data.rstProdu
      })
    } else {
      this.getWeRunStepsData();
    }
  },
  sendFriend: function () {
    wx.navigateTo({
      url: '../../pages/recommend/index'
    })
  },
  profilePage: function () {
    wx.navigateTo({
      url: '../../pages/profile/index'
    })
  },
  settingPage: function () {
    wx.navigateTo({
      url: '../../pages/setting/index'
    })
  },
  getMyprofileInfo: function () {
  },
  getWeRunStepsData: function () {
    let that = this;
    wx.login({
      success: (res) => {
            wx.getWeRunData({
              success(resRun) {
                const encryptedData = resRun
                console.info(resRun);
                wx.request({
                  url: app.globalData.baseUrl + '/remote/oauth/mini/getEncryptedData',
                  method: 'GET', 
                  header: {
                    'Content-Type': 'application/json',
                    "token": app.globalData.token
                  },
                  data: {
                    encryptedData: resRun.encryptedData,
                    iv: resRun.iv,
                    sessionkey : app.globalData.userInfo.session_key
                  },
                  success: function (resDecrypt) {
                    if(resDecrypt.data.data.length > 0){
                      //let runData = resDecrypt.data.data;
                      let runData = JSON.parse(resDecrypt.data.data); 
                      if (runData.stepInfoList.length > 0)
                      {
                        runData.stepInfoList = runData.stepInfoList.reverse()
                        for (var i in runData.stepInfoList)
                        {
                          runData.stepInfoList[i].date = util.formatTime(new Date(runData.stepInfoList[i].timestamp*1000)).split(' ')[0]
                        }
                        that.setData({ runData: runData.stepInfoList });
                        app.globalData.runData = runData.stepInfoList;
                        that.getQueryLatestime(runData.stepInfoList)
                      }
                      //授权成功跳转
                      app.globalData.isWeRunSteps = true;
                      wx.navigateTo({
                        url: '../../pages/healthPage/index?id=' + that.data.rstProdu
                      })
                      // //记录领取积分
                      // that.getintegral();  
                      that.setData({ runData: runData.stepInfoList });
                      app.globalData.runData = runData.stepInfoList;
                    }
                  },
                  fail: function () {
                    console.log('----------')
                  }
                });
              },
              fail: function () {
                  wx.navigateTo({
                    url: '../../pages/healthPage/index?flg=' + that.data.btnHidden
                  })
              }
            })
        }
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
        data:{
          //  type:'MINIP',
		      //  source:'string'
          source: 'MINIP'
        },
        success: (res) => {
          if (res.data.code === 200) {
              //最后上传时间戳 和 当前时间戳进行比较
              let dayTime = parseInt(new Date().getTime() / 1000);
              let lastTime = res.data.data.time;
              if (res.data.data.type !== 'register'){
                  if(util.timestampToTime(dayTime) !== util.timestampToTime(lastTime)){
                    that.getUploaddata(runData, res.data.data.type);
                  }
              }else{
                   that.getUploaddata(runData, res.data.data.type);
              }
          }
        }
      })
  },
  //运动数据同步上传
  getUploaddata: function (runData, type) {
    console.log('runDatarunData',runData);
    let runDataArray = [];
    runData.forEach((item)=>{
      runDataArray.push({
          endTime:  item.timestamp +'',
          startTime: item.timestamp +'',
          steps: item.step
      })
    })
    console.log('runDataArrayrunDataArray',runDataArray)
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
        caloriesDataModelList :[],
        distanceDataModelList :[],
        stepsDataModelList: type === 'register' ? runDataArray : [runDataArray[0]],
      },
      success: (res) => {
        if (res.data.code === 200) {
            console.log('数据同步成功')
        }
      }
    })
},
})