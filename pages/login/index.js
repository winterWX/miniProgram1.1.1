// pages/login/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    urlTag:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('optionsoptions',options)
    if (options.url && options.url.indexOf('/#') > -1) {
      let baseUrlNum = ''
      let startStr = options.url.substr(0, options.url.indexOf('/#'));
      let endStr = options.url.substr(options.url.indexOf('/#') + 2, options.url.length - 1);
      baseUrlNum = startStr + '?goodsId=' + endStr;
      this.setData({ url: baseUrlNum })
    }else if(options.pageTag === 'pageTag'){
      this.setData({ urlTag: 'pageTag' })
    }else {
      this.setData({
        url: options.url
      })
    }
    console.log(options)
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
  onShareAppMessage: function () {

  },
  phoneNumberLogin (data) {
    const parms = {
      encryptedData: data.encryptedData,
      iv: data.iv,
      openId: app.globalData.userInfo.openId,
      avatarUrl: app.globalData.userInfo.avatarUrl,
      invitationCode: app.globalData.invitationCode
    }
    console.log('parms注册的信息',parms);
    wx.showLoading({
      title: 'loading...',
    })
    wx.request({
      method: 'post',
      url: app.globalData.baseUrl + '/remote/register/miniProgram/add',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      data: parms,
      success: (res) => {
        if (res.data.code === 200) {
            console.log('所有的返回信息',res);
            const { data: { data: { token, phoneNumber,integral={},isFriend}}} = res;
            app.globalData.token = token;
            app.globalData.phoneNumber = phoneNumber;
            let integralFlg = integral.flag !== undefined ? integral.flag : '';
            if(this.data.urlTag === 'pageTag' && integralFlg === 'true'){
                wx.redirectTo({ url: '../index/index?flag='+ integralFlg });
            }else if((this.data.urlTag === 'pageTag' && integralFlg === '') && !isFriend){
                console.log('新的好友列表 urlTag  integralFlg  ！isFriend', this.data.urlTag,integralFlg,!isFriend);
                let addSuccess = 'addSuccess';
                wx.redirectTo({ url: '../newFriend/index?addSuccess='+ addSuccess });
            }else if(this.data.urlTag === 'pageTag' && isFriend){
                //是否已经互为好友
                console.log('是否已经互为好友',isFriend);
                wx.redirectTo({ url: '../addFriend/index' });
            }
            wx.reLaunch({
              url: this.data.url + '?flag=' + integralFlg,
              complete: () => {}
            })
        } else {
            wx.showModal({
              showCancel: false,
              content: res.message,
              success: (res) => { }
            })
        }
        wx.hideLoading()
      }
    })
  },
  getPhoneNumber (e) { //获取电话信息     
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      this.phoneNumberLogin(e.detail)
    } else {
      wx.redirectTo({
        url: '../index/index',
        complete: () => {

        }
      })
    }
  },
  stopLogin () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
})