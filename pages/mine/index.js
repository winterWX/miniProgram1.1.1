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
    active: 2,  //下标
    //activeFooter: 2, //选中下标
    runData:[],
    isAppData: false,  //判断是不是app用户
    typeFlg:'',
    showDialog:false,
    userInfo: {},
    windowHeight: wx.getSystemInfoSync().windowHeight *2,
    avatar: 13,
    color: 'copper',
    activityCount: 0,
    hideModal: true,  //模态框的状态  true-隐藏  false-显示
    titleText:false,
    baseUrl: app.globalData.imagesUrl,
    avatarObjList: [
      {
        url: app.globalData.imagesUrl + '/images/icon/icon-defult-touxiang.png',
        id: 13
      }, {
        url: app.globalData.imagesUrl + '/images/icon/icon-laoshu.png',
        id: 1
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconNiu.png',
        id: 2
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconLaohu.png',
        id: 3
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconTuzi.png',
        id: 4
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconLong.png',
        id: 5
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconShe.png',
        id: 6
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconMa.png',
        id: 7
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconYang.png',
        id: 8
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconHouzi.png',
        id: 9
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconJi.png',
        id: 10
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconGou.png',
        id: 11
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconZhu.png',
        id: 12
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.checkIsAppUser();
    that.getMyprofileInfo();
    that.getActivityList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let complete = wx.getStorageSync('complete');
    that.setData({complete, active: 2 });
    that.checkIsAppUser();
    that.getMyprofileInfo();
    that.getActivityList();
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
  // 会员等级
  silverDetail: function () {
    wx.navigateTo({
      url: '../../pages/silverDetail/index'
    })
  },
  integralDetails: function () {
    wx.navigateTo({
      url: '../integralDetails/index'
    })
  },
  messageCenter: function() {
    wx.navigateTo({
      url: '../messageCenter/index'
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
              let time = util.formatTime(new Date(Number(res.data.data)));
              let latestTime = time.split(' ')[0];
              let result = runData.find(item => item.date === latestTime);
              let index = runData.indexOf(result);
              let results = runData.splice(0, index + 1).map(item=>{
                   return {
                      startTime: item.timestamp + '',
                      endTime: item.timestamp + '',
                      steps: item.step
                   }
              });
              that.getUploaddata(results);
              // let time = res.data.data;
              // const runArray = that.runArray(runData,time);
              // that.getUploaddata(runArray);
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
        lastTime: new Date().getTime() + '',
        stepsDataModelList: runData,
      },
      success: (res) => {
        if (res.data.code === 200) {
            that.healthSccuss();
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
      return util.timestampToTime(new Date(item.endTime * 1000)) === util.timestampToTime(new Date(lastTime));
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
},
getMyprofileInfo: function () {
  let that = this;
  let colorMap = {
    1: 'copper',
    2: 'silver',
    3: 'gold'
  }
  wx.request({
    url: app.globalData.baseUrl + '/myprofile/homepage/search',
    method: "GET",
    header: {
      'Content-Type': 'application/json',
      "token": app.globalData.token
    },
    success: function (res) {
      if (res.data.code == 200) {
        let userInfo = res.data.data;
        let color = colorMap[userInfo.level]
        let avatar = userInfo.avatar || 13;
        that.setData({userInfo, avatar, color});
      } 
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
  })
},
getActivityList: function () {
  let that = this;
  // wx.showToast({ title: '加载中', icon: 'loading' });
  wx.request({
    url: app.globalData.baseUrl + '/remote/myactivity/list',
    method: "POST",
    header: {
      'Content-Type': 'application/json',
      "token": app.globalData.token
    },
    data: {
      currentPage: 1,
      pageSize: 10,
      "status": [
        {
          "status": 1
        },
        {
          "status": 2
        }
      ]
    },
    success: function (res) {
      // wx.hideToast();
      if (res.data.code == 200) {
        let activityCount = res.data.totalCount;
        that.setData({ activityCount});

      }
    },
    fail: function (res) {
      // wx.hideToast();
    }
  })
},
textShowMain:function (e) {
  let that = this;
  if(e.currentTarget.dataset.flag === 'about'){
    that.setData({titleText: true});
  }else{
      that.setData({titleText: false});
  }
  that.setData({ hideModal: false })
  let animation = wx.createAnimation({
    duration: 100,//动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
    timingFunction: 'ease',//动画的效果 默认值是linear
  })
  this.animation = animation
  setTimeout(function () {
    that.fadeIn();  //调用显示动画
  }, 100)
},
// 隐藏遮罩层
hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 100,  //动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',  //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function () {
      that.setData({ hideModal: true })
    }, 100)  //先执行下滑动画，再隐藏模块
  },
//动画集
fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()  //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
fadeDown: function () {
    this.animation.translateY(1000).step()
    this.setData({ animationData: this.animation.export()})
},
closePage:function(){
  let that =this;
  that.fadeDown();
  that.setData({ hideModal: true })
 }
})