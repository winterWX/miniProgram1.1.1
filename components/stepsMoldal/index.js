const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showNumber:{
        type: Number,
        value: 0,
        observer(value) {}
    },
    showFlag:{
      type: String,
      value: '',
      observer(value) {}
    }    
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
    },
    onStapeDataCanel:function(){
      this.triggerEvent('modelShowBlockCanel', {
        modelShowCanel: true
      }, {})
    },
    termsUse(){
      wx.navigateTo({ url: '../../pages/textTermsUse/index' });
    },
    privacyAgreement(){
      wx.navigateTo({ url: '../../pages/textPrivacyStatement/index' });
    },

    artContinue(){
        this.triggerEvent('artContinue', {
          artContinue: app.globalData.isLogin == 3 ?  true : false
        }, {})
    },
    
    artcancel(){
      this.triggerEvent('artcancel', {
        artcancel:  app.globalData.isLogin == 3 ? true : false
      }, {})
    },

    couponContinueBtn(){
      this.triggerEvent('couponContinueBtn', {
        couponContinueBtn: true 
      }, {})
    },

    couponCancelBtn(){
      this.triggerEvent('couponCancelBtn', {
        couponCancelBtn: true 
      }, {})
    }
  }
})
