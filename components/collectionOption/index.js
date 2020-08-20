import lottie from 'lottie-miniprogram';
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFell(){
      this.triggerEvent('parentReceive', {
        handleSuccess: true
      }, {})
    },
    restFilterDatas(){
      let that = this;
      wx.request({
        url: app.globalData.baseUrl + '/json/integralAmation.json',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        success: function (res) {
            console.log('resres', res)
            that.handleMore(res);
        },
        fail: function (res) {
            console.log('.........fail..........');
        }
      })
    },
    handleMore(data) {
      console.log('datadata', data);
      // wx.createSelectorQuery().select('#canvas').node(res => {
      //   const canvas = res.node
      //   lottie.setup(canvas)
      // }).exec()
      wx.createSelectorQuery().select('#canvas').node(res => {
        const canvas = res.node
        const context = canvas.getContext('2d')
        canvas.width = 300//设置宽高，也可以放到wxml中的canvas标签的style中
        canvas.hight = 300
        lottie.setup(canvas)//要执行动画，必须调用setup,传入canvas对象
        lottie.loadAnimation({//微信小程序给的接口，调用就完事了，原理不太懂
          loop: true,//是否循环播放（选填）
          autoplay: true,//是否自动播放（选填）
          path:  data,//lottie jso求域名要添加到小程序的合法域名中
          rendererSettings: {
            context//es6语法：等同于context:context（必填）
          }
        })
      }).exec()
    },
  }
})
