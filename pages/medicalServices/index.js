// pages/medicalServices/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:3,
    imageList: [{
      id: 1,
      url: '../../image/medical/banner-1.png'
    }, {
      id: 2,
      url: '../../image/medical/banner-4.png'
    }],
    currentImg: {},
    background: ['../../image/medical/banner-1.png', '../../image/medical/banner-4.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
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
      active: 3
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
  onShareAppMessage: function () {

  },
  clickHandle: function(e) {
    console.log('>>>>>>>>>>>>>>>>>>>>>')
    console.log(e.currentTarget.dataset.id);
    let { dataset: {id} } = e.currentTarget;
    let url = id && id === 1 ? true : false;
  }
})