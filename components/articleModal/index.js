const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    levelNum: {
      type: Number,
      value: 0,
      observer(value) { }
    },
    levelLookNum: { 
      type: Array,
      value: [],
      observer(value) { }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imagesUrl: app.globalData.imagesUrl,
    textShow:''
  },

  lifetimes: { // 生命周期
    ready: function () {
        this.levelLookText()
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //立即绑定
    lookLevels: function(){
      this.triggerEvent('lookLevels', {
        lookLevelBlock: true
      }, {})
    },

    closeBlock: function(){
      this.triggerEvent('closeBlock', {
        closeBlock: true
      }, {})
    },

    lookLevels:function(){
      this.data.levelNum = this.data.levelNum === ( 2 || 3 ) ? 1 : this.data.levelNum;
      wx.navigateTo({
        url: this.data.levelNum == 2 || this.data.levelNum == 4 ? '../../pages/goldStrategy/index' : 
        (this.data.levelNum == 3 || this.data.levelNum == 5 ? '../../pages/goldStrategy/index': '../../pages/strategy/index') 
      })
    },
    
    levelLookText:function(){
      if(this.data.levelLookNum.includes('4') && this.data.levelLookNum.includes('5')){
          this.setData({ textShow : '[VIP金会员/VIP银会员]'})
      }else if(this.data.levelLookNum.includes('4')){
          this.setData({ textShow : '[VIP银会员]'})
      }else if(this.data.levelLookNum.includes('5')){
          this.setData({ textShow : '[VIP金会员]'})
      }
    }
  }
})

