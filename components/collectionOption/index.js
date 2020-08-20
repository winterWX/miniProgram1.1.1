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
      wx.request({
        url: app.globalData.baseUrl + '/json/integralAmation.json',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        success: function (res) {
          if (res.data.code == 200) {
              console.log('resres', res)
          }
        },
        fail: function (res) {
             console.log('.........fail..........');
        }
      })
    },
    handleMore() {
      wx.createSelectorQuery().select('#canvas').node(res => {
        const canvas = res.node
        lottie.setup(canvas)
      }).exec()
    },
  }
})
