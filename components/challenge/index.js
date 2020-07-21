// components/challenge/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    todaySteps: {
      type: Number,
      value: 0
    },
    targetSteps: {
      type: Number,
      value: 10000
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
    list:[
      {
        receiveStatus:1,//已领        
        day:'1',
        reward:'+10',
        iconPath:'../../images/icon-got-the-points@2x.png'       
      },
      {
        receiveStatus: 4, //过期      
        day: '2',
        reward: '+10',
        iconPath: '../../images/icon-10-points-black@2x.png'              
      },      
      {
        receiveStatus: 1,//补领       
        day: '3',
        reward: '+10',
        iconPath: '../../images/icon-10-points@2x.png'         
      },      
      {
        receiveStatus: 3,//补领       
        day: '4',
        reward: '+10',
        iconPath: '../../images/icon-10-points@2x.png'           
      },
      {
        receiveStatus: 2,//还不到时间领      
        day: '5',
        reward: '+10',
        iconPath: '../../images/icon-10-points@2x.png'              
      },      
      {
        receiveStatus: 2,//还不到时间领      
        reward: '+10',
        day: '6',
        iconPath: '../../images/icon-10-points@2x.png'             
      },
      {
        receiveStatus: 2,//还不到时间领       
        day: '7',
        reward: '+50',
        iconPath: '../../images/icon-50-points@2x.png'             
      }
    ]
  },
  lifetimes: { // 生命周期
    ready: function () {
      this.getCurrentList()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getCurrentList(){//获取打卡列表
      wx.showLoading({
        title: 'loading...',
      })
      wx.request({
        method: 'post',
        url: app.globalData.baseUrl + '/remote/challenge/currentList',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        data: {
          "currentTime": "1595209173",
          "startTime": "1595209173"
        },
        success: (res) => {
          if (res.data.code === 200) {

          } else {
            wx.showModal({
              showCancel: false,
              content: res.message,
              success: (res) => { }
            })
          }
          wx.hideLoading()
        }
      })


    },
    receiveIntegral(){//领取积分      
        wx.showLoading({
          title: 'loading...',
        })       
        wx.request({
          method: 'post',
          url: app.globalData.baseUrl + '/remote/today/step/receiveIntegral',
          header: {
            "Content-Type": "application/json;charset=UTF-8",
            "token": app.globalData.token
          },
          data: {},
          success: (res) => {
            if (res.data.code === 200) {

            } else {
              wx.showModal({
                showCancel: false,
                content: res.message,
                success: (res) => { }
              })
            }
            wx.hideLoading()
          }
        })

      
    },
    makeupIntegral() {//补领积分      
      wx.showLoading({
        title: 'loading...',
      })
      const parms = {
        challengeId:"1",
        receivePoints:"10"
         }
      wx.request({
        method: 'post',
        url: app.globalData.baseUrl + '/challenge/makeup',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        data: parms,
        success: (res) => {
          if (res.data.code === 200) {

          } else {
            wx.showModal({
              showCancel: false,
              content: res.message,
              success: (res) => { }
            })
          }
          wx.hideLoading()
        }
      })


    },
    gotoHistory(){
      console.log(22)
      wx.navigateTo({
        url: '../history/index',
      })
    }



  }
})
