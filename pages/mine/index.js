const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rstProdu: 'rstProdu',
    btnHidden: 'btnHidden',
    active: 4,
    userInfo: {
      nickName: '',
      gender: '',
      birthday: '--',
      avatarUrl: '',
      phone: '',
      email: '未绑定',
      percentage: 0
    }
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
    this.getMyprofileInfo();
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
    console.log(this.data);
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
  onShareAppMessage: function () {
    
  },
  healthPage: function () {
    if (app.globalData.loginSuccess && app.globalData.isWeRunSteps) {
      let that = this;
      wx.navigateTo({
        url: '../../pages/healthPage/index?id=' + that.data.rstProdu
      })
    } else {
      this.getWeRunStepsData();
    }
  },
  sendFriend: function () {
      wx.navigateTo({
        url: '../../pages/recommend/index'
      })
  },
  getWeRunStepsData: function () {
    let that = this;
    wx.getWeRunData({
      success: function (res) {
        app.globalData.isWeRunSteps = true;
        wx.navigateTo({
          url: '../../pages/healthPage/index?id=' + that.data.rstProdu
        })
      },
      fail: function () {
        wx.navigateTo({
          url: '../../pages/healthPage/index?flg=' + that.data.btnHidden
        })
      }
    })
  },
  getWeRunStepsRefs: function () {
    wx.getWeRunData({
      success: function (res) {
        wx.navigateTo({
          url: '../../pages/healthPage/index',
        })
      },
      fail: function () {
        console.log('---------')
      }
    })
  },
  getMyprofileInfo: function () {
  }
})