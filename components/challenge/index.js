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
    continuousComplianceDays:0,
    days:{
      days:'',
      integral:''
    },
    list:[
      // {
      //   receiveStatus:1,//已领        
      //   day:'1',
      //   reward:'+10',
      //   iconPath:'../../images/icon-got-the-points@2x.png'       
      // },
      // {
      //   receiveStatus: 4, //过期      
      //   day: '2',
      //   reward: '+10',
      //   iconPath: '../../images/icon-10-points-black@2x.png'              
      // },      
      // {
      //   receiveStatus: 1,//补领       
      //   day: '3',
      //   reward: '+10',
      //   iconPath: '../../images/icon-10-points@2x.png'         
      // },      
      // {
      //   receiveStatus: 3,//补领       
      //   day: '4',
      //   reward: '+10',
      //   iconPath: '../../images/icon-10-points@2x.png'           
      // },
      // {
      //   receiveStatus: 2,//还不到时间领      
      //   day: '5',
      //   reward: '+10',
      //   iconPath: '../../images/icon-10-points@2x.png'              
      // },      
      // {
      //   receiveStatus: 2,//还不到时间领      
      //   reward: '+10',
      //   day: '6',
      //   iconPath: '../../images/icon-10-points@2x.png'             
      // },
      // {
      //   receiveStatus: 2,//还不到时间领       
      //   day: '7',
      //   reward: '+50',
      //   iconPath: '../../images/icon-50-points@2x.png'             
      // }
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
    formateTime(value) {
      //当天凌晨的时间戳
      const h1 = new Date(new Date().setHours(0, 0, 0, 0)) / 1000 
      //当天时间截止的时间戳
      const h2 = new Date(new Date().setHours(23, 59, 59, 999))/1000
      console.log(h1,h2)

    },
    getCurrentList(){//获取打卡列表
      // wx.showLoading({
      //   title: 'loading...',
      // })
      wx.request({
        method: 'post',
        url: app.globalData.baseUrl + '/remote/challenge/currentList',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        data: {
          "currentTime": Date.parse(new Date()) / 1000         
        },
        success: (res) => {
          if (res.data.code === 200) {
            var continuousComplianceDays=0;
            var len = res.data.data.length
            if (len>1 && res.data.data[len-1].continuousComplianceDays === -1) {              
              if (res.data.data[len - 2].isdone === "1") {
                continuousComplianceDays = res.data.data[len - 2].continuousComplianceDays
              }
            }else{
              if (res.data.data[len - 1].isdone === "1"){
                continuousComplianceDays = res.data.data[len - 1].continuousComplianceDays
              }
              
            }
            
            this.setData({
              continuousComplianceDays: continuousComplianceDays
            })
            
            var index = this.data.continuousComplianceDays % 7            
            var list = res.data.data.splice(len-index)
           
            var lastTime=0
            var newList=[]
            for (var i=0; i<7; i++) {
              var item={}
              if(i < list.length){
                item = list[i]
                lastTime=item.createTime
              }else{
                item={
                  createTime: lastTime + (24 * 60 * 60) * (i-list.length+1),                 
                  isdone: "2",
                  receiveStatus: "2",
                  startTime: lastTime + (24 * 60 * 60) * (i - list.length+1), 
                  uid: 87,
                  continuousComplianceDays: -1                 

                }
              }
              //当天凌晨的时间戳
              const h1 = new Date(new Date().setHours(0, 0, 0, 0)) / 1000
              //当天时间截止的时间戳
              const h2 = new Date(new Date().setHours(23, 59, 59, 999)) / 1000
              var reward = 10
              if (this.data.continuousComplianceDays < 8) {
                if (i == 6) {
                  reward = 50
                  this.setData({
                    days: {
                      day: 7 - this.data.continuousComplianceDays,
                      integral: 50
                    }
                  })
                }
              } else if (this.data.continuousComplianceDays > 21 || this.data.continuousComplianceDays == 21) {
                if (i == 6) {
                  reward = 100
                  this.setData({
                    days: {
                      day: 28 - this.data.continuousComplianceDays,
                      integral: 100
                    }
                  })
                }
              }
              var dayName =''
              var iconPath = '../../images/icon-got-the-points@2x.png'
              if (h1 <= item.createTime && item.createTime <= h2){
                dayName="今日"
                if (item.receiveStatus == '2'){
                  iconPath = '../../images/icon-' + reward + '-points@2x.png'
                }
                 
              } else if ((h1 - 24 * 60 * 60) <= item.createTime && item.createTime <h1) {
                dayName = "昨天"
                if (Date.parse(new Date()) / 1000 < h1 + 10 * 60 * 60) {
                  iconPath = '../../images/icon-' + reward + '-points@2x.png'                 
                } else {
                  iconPath = '../../images/icon-' + reward + '-points-black@2x.png'
                  //reward = 0
                }

              }else{                
                if(item.isdone =="1"){
                  dayName = '第' + item.continuousComplianceDays + '天'
                  if (item.receiveStatus == '2'){
                    iconPath = '../../images/icon-' + reward + '-points-black@2x.png'
                  }
                }else{
                  dayName = '第' + (this.data.continuousComplianceDays + i + 1) + '天'
                  if (item.receiveStatus == '2') {
                    iconPath = '../../images/icon-' + reward + '-points@2x.png'
                  }
                }
                
              }

              const otherItem={
                dayName: dayName,
                reward: reward, 
                iconPath: iconPath  
              }
              item = { ...item, ...otherItem}
              newList.push(item)
            }
            console.log(newList)
            this.setData({
              list: newList
            })
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
    receiveIntegral(e){
      const item = e.currentTarget.dataset.item
      const index = e.currentTarget.dataset.index      
      if (item.receiveStatus == 2 && item.isdone ==1 && item.dayName=='今日'){
        this.todayIntegral(item, index)
      } else if (item.receiveStatus == 2 && item.isdone == 1 && item.dayName == '昨天' && item.reward !=0){
        this.yesterdayIntegral(item,index)
      }
    },
    todayIntegral(item,i){//领取积分      
        wx.showLoading({
          title: 'loading...',
        })       
        wx.request({
          method: 'get',
          url: app.globalData.baseUrl + '/remote/today/receiveIntegral',
          header: {
            "Content-Type": "application/json;charset=UTF-8",
            "token": app.globalData.token
          },        
          success: (res) => {
            if (res.data.code === 200) {
              var list=this.data.list
              list[i].receiveStatus=1
             this.setData({
               list:list
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
    yesterdayIntegral(item,i) {//补领积分      
      wx.showLoading({
        title: 'loading...',
      })
      const parms = {
        challengeId: item.id,
        receivePoints:item.reward
         }
      wx.request({
        method: 'post',
        url: app.globalData.baseUrl + '/remote/challenge/makeup',
        header: {
          "Content-Type": "application/json;charset=UTF-8",
          "token": app.globalData.token
        },
        data: parms,
        success: (res) => {
          if (res.data.code === 200) {
            var list = this.data.list
            list[i].receiveStatus = 1
            this.setData({
              list: list
            })
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
