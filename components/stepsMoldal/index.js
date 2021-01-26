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
    userAgreement(){
      // wx.navigateTo({ url: '../../pages/userAgreement/index' });
      wx.navigateTo({ url: '../../pages/textUserAgreements/index' });
    },
    privacyAgreement(){
      // wx.navigateTo({ url: '../../pages/privacyAgreement/index' });
      wx.navigateTo({ url: '../../pages/textPrivacyStatement/index' });
    },
    continueBtn(){
      this.triggerEvent('artContinueBtn', {
        artContinueBtn: true
      }, {})
    },
    cancelBtn(){
      this.triggerEvent('artCancelBtn', {
        artCancelBtn: true
      }, {})
    }
  }
})
