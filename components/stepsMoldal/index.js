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
    imagesUrl: app.globalData.imagesUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //立即绑定
    onStapeData: function(){
      this.triggerEvent('modelShowBlock', {
        modelShow: true
      }, {})
    }
  }
})
