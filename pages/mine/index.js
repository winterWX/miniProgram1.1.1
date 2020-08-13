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
    console.log('back');
    const { nickName, gender, birthday = '', avatarUrl } = app.globalData.userInfoDetail;
    const userInfo = {
      nickName,
      avatarUrl,
      gender: gender === 1 ? '男' : '女',
    }
    this.setData({
      userInfo: Object.assign(this.data.userInfo, userInfo)
    })
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
  onShareAppMessage: function () { },
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
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/myprofile/homepage/search',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 200) {
          const { nickName, gender, avatarUrl } = app.globalData.userInfoDetail;
          const { data: { data: {birthday, email, mobile, percentage} } } = res;
          let userInfo = {
            nickName: nickName,
            gender: gender === 1 ? '男' : '女',
            birthday: birthday || '--',
            avatarUrl: avatarUrl,
            phone: mobile || '未绑定',
            email: email || '未绑定'
          }
          userInfo.percentage = that.getPercentage(userInfo);
          that.setData({
            userInfo: userInfo
          })
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
    // }
  },
  getPercentage: function(userInfo) {
    let allKeys = Object.keys(userInfo).length;
    let keysWithValue = 0;
    for (let key in userInfo) {
      if (userInfo[key] && userInfo[key] !== '--' && userInfo[key] !== '未绑定') {
        keysWithValue++;
      }
    }
    return (keysWithValue / allKeys).toFixed(2) * 100;
  }
})