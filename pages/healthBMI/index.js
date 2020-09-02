// pages/healthBMI/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    BMIData:{},
    background: '',
    BMIleft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('optionsoptions',options)
      let that = this;
      let BMIData = JSON.parse(options.initData)
      that.setData({
         BMIData
      })
      that.BMIleftAnmation(that.data.BMIData.bmi)
      console.log('BMIDataBMIData',that.data.BMIData)
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
  BMIleftAnmation:function(num){
    console.log('111111111',typeof num)
    let that = this;
    let numData = num.toFixed(1);
    if(parseFloat(16.0) <= parseFloat(numData) && parseFloat(numData) < parseFloat(18.5)){
        let BMIleft =  (parseFloat(18.5) - parseFloat(numData)) * parseFloat(6.0);
        that.setData({
          background: '#9B7C56'
        })
        that.setData({
          BMIleft
        })
    }else if(parseFloat(18.5) <= parseFloat(numData) && parseFloat(numData) < parseFloat(25.0)){
       //28%
       let BMIleft =  parseFloat((parseFloat(25.0) - parseFloat(18.5)) * parseFloat(4.3)) + parseFloat(15.0);
        that.setData({
          background: '#34A344'
        })
        that.setData({
          BMIleft
        })
    }else if(parseFloat(25.0) <= parseFloat(numData) && parseFloat(numData) < parseFloat(35.0)){
        let BMIleft =  parseFloat((parseFloat(35.0) - parseFloat(25.0)) * parseFloat(2.2)) + parseFloat(43.0);
        //22%
        //43
        that.setData({
          background: '#EDAE26'
        })
        that.setData({
          BMIleft
        })
    }else if(parseFloat(numData) > parseFloat(35.0)){
        let BMIleft =  parseFloat((parseFloat(numData) - parseFloat(35.0)) * parseFloat(1.85)) + parseFloat(65.0);
        //35%
        //65
        that.setData({
          background: '#B10D19'
        })
        that.setData({
          BMIleft
        })
    }
  }
})