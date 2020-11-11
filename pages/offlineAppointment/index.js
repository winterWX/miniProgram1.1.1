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
    let mobile = app.globalData.phoneNumber;
    this.getTransactionid(mobile);
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
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/interrogation/cumc/findinter',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token,
        "native-app": "mini"
      },
      data: {
        mobile: mobile
      },
      success: function (res) {      
        let { membershipid, transationid } = res.data.data;
        let url = `https://www.cuclinic.hk/zh-hant/my_appointment/?cid=${membershipid}&tid=${transationid}&mti=E-booking`
        that.setData({url});
      },
      fail: function (res) {
        reject(false);
      }
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