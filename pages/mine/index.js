const app = getApp();
const util = require('../../utils/util')
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
    typeFlg:''
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
    let that = this;
    if(that.data.isAppData){
      that.carryAPPData();
    }else{
      if (app.globalData.loginSuccess && app.globalData.isWeRunSteps) {
        that.healthSccuss();
      } else {
        that.getWeRunStepsData();
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
  addFriend: function () {
    wx.navigateTo({
      url: '../../pages/addFriend/index'
    })
  },
  getWeRunStepsData: function () {
    let that = this;
    wx.login({
      success: (res) => {
          if(res.code){
            that.getKeySessionData(res.code);
          }
        },
      fail: function(res) {
        console.log('----------');
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
          source: 'string'
        },
        success: (res) => {
          if (res.data.code === 200) {
              //最后上传时间戳 和 当前时间戳进行比较
              const {time,type} = res.data.data;
              that.setData({typeFlg: type});
              let dayTime = parseInt(new Date().getTime() / 1000);
              const runArray = that.runArray(runData,time);
              if (type !== 'register'){
                  if(util.timestampToTime(dayTime) !== util.timestampToTime(time)){
                      that.getUploaddata(runArray);
                  }else{
                      that.getUploaddata(runArray);
                  }
              }else{
                  that.getUploaddata(runArray);
              }
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
getKeySessionData(code) {
  let that = this;
  wx.getSetting({
    success: (setingres) => {
      if (setingres.authSetting['scope.userInfo']) {               
        wx.getUserInfo({
          success: (res) => {
            that.miniproLogin(code,res.encryptedData,res.iv)
          },
          fail: () => {
             console.log('---------------')
          }
        })
      }
    }
  })
},
getAllWeRunData:function(sessionkey){
  let that = this;
  wx.getWeRunData({
    success(resRun) {
      const encryptedData = resRun
      console.info(resRun);
      wx.request({
        url: app.globalData.baseUrl + '/remote/oauth/mini/getEncryptedData',
        method: 'POST', 
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        data: {
          encryptedData: resRun.encryptedData,
          iv: resRun.iv,
          sessionkey : sessionkey
        },
        success: function (resDecrypt) {
          if(resDecrypt.data.data.length > 0){
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
          url: '../../pages/healthPage/index?flg=' + that.data.refusedTo
        })
    }
  })
},
miniproLogin:function(code,enData,ivData){
  let that = this;
  const parms = {
    code:code,
    encrypteData: enData,
    iv: ivData
  }
  wx.request({
    method: 'POST',
    url: app.globalData.baseUrl + '/remote/oauth/minipro/login',
    header: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    data: parms,
    success: (res) => {
      if (res.data.code === 200) {
        that.getAllWeRunData(res.data.data.session_key);
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
          that.setData({
            isAppData: res.data.data === 1 ? true : false
          })
          //数据源
          app.healthStep.dataCource = res.data.data;
      }
    }
  })
},
runArray:function(array,lastTime,type){
    let that = this;
    let runDataArray = [];
    array.forEach((item)=>{
      runDataArray.push({
          endTime:  item.timestamp + '',
          startTime: item.timestamp + '' ,
          steps: item.step
        })
    })
    if(that.data.typeFlg !== 'register'){
      const indexs = runDataArray.findIndex(item =>{
        return util.timestampToTime(item.endTime) === util.timestampToTime(lastTime);
      })
      if(indexs > -1){
        return runDataArray.splice(0,indexs+1)
      }
      return runDataArray;
    }else{
      return runDataArray;
    }
  }
})