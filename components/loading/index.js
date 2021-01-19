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
    loadingState: false,
    maskState: false,
    imagesUrl: app.globalData.imagesUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // title = "加载中..." 
    show({ mask = false } = {}){
      this.setData({
        loadingState: true,
        maskState: mask
        //loadingText: title
      })
    },
    hide(){
      let that = this;
      setTimeout(function(){
          that.setData({
            loadingState: false
          })
      }, 1200)
    }
  }
})


