let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://www.cuclinic.hk/en/my_appointment/?cid=18k&tid=345&mti=456'
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
    console.log('sunbinbin')
    console.log(app.globalData.phoneNumber);
    let mobile = app.globalData.phoneNumber;
    let getTransactionid = this.getTransactionid(mobile);
    let getMembershipid = this.getMembershipid(mobile);
    Promise.all([getTransactionid, getMembershipid]).then(data => {
      console.log('???????????????????????')
      console.log(data);
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  getTransactionid: function(mobile) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.baseUrl + '/remote/interrogation/cumc/findinter',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        data: {
          mobile: mobile
        },
        success: function (res) {
          console.log('Transactionid');
          console.log(res.data)
          resolve(res.data.data);
        },
        fail: function (res) {
          reject(false);
        }
      })
    })
  },
  getMembershipid: function(mobile) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.globalData.baseUrl + '/remote/register/mobile/findmember',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        data: {
          mobile: mobile
        },
        success: function (res) {
          console.log('Membershipid');
          console.log(res);
          resolve(res.data.data);
        },
        fail: function (res) {
          reject(false)
        }
      })
    })
  },
  copyData: function() {
    let { url } = this.data;
    wx.setClipboardData({
      data: url,
      success: (res) => {
        console.log('success');
      },
      fail: (res) => {
        console.log('fail');
      },
      complete: () => {
        console.log('complete');
      }
    })
  }
})