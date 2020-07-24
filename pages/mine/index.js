const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rstProdu:  'rstProdu',
    btnHidden: 'btnHidden',
    active: 4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      active: 4
    })
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
  onShareAppMessage: function() {},
  healthPage:function(){
      if(app.globalData.loginSuccess === true){
        this.getWeRunStepsData();
        //   wx.authorize({
        //     scope: 'scope.werun',
        //     success: function() {
        //         console.log("success");
        //     },
        //     fail: function () {
        //         console.log("fail");
        //     }
        // })
  }
  },
  getWeRunStepsData: function(){
      let that = this;
      wx.getWeRunData ({
        success: function(res) {
              wx.navigateTo({
                url: '../../pages/healthPage/index?id='+ that.data.rstProdu
              })
        },
        fail: function () {
            console.log(' that.data.btnHidden', that.data.btnHidden);
            wx.navigateTo({
              url: '../../pages/healthPage/index?flg='+ that.data.btnHidden
            })
        }
    })
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res);
    //     if (!res.authSetting['scope.werun']) {
    //       wx.showModal({
    //         title: '提示',
    //         content: '获取微信运动步数，需要开启计步权限',
    //         success: function (res) {
    //           if (res.confirm) {
    //             //跳转去设置
    //             wx.openSetting({
    //               success: function (res) {
    //               }
    //             })
    //           } else {
    //             //不设置
    //           }
    //         }
    //       })
    //     } else {
    //       wx.getWeRunData({
    //         success: function (res) {
    //           console.log(res);
    //         },
    //         fail: function (res) {
    //           wx.showModal({
    //             title: '提示',
    //             content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
    //             showCancel: false,
    //             confirmText: '知道了'
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },
  getWeRunStepsRefs:function(){
      wx.getWeRunData ({
        success: function(res) {
              wx.navigateTo({
                url: '../../pages/healthPage/index',
              })
        },
        fail: function () {
            console.log('---------')
        }
    })
  }
})