let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rate: 0,
    success: true,
    wrong: 0,
    all: 0,
    questionAnalysis: [],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { rate, success, id } = options;
    this.setData({rate, success: success === 'true', id });
    this.getQuestion(id);
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
  getQuestion: function(id) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/health/quiz/desc?id=' + id,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        if(res.data.code === 200) {
          let {quizResult: {correct, wrong, questionAnalysis, rate, status}} = res.data.data;
          let all = correct + wrong;
          that.setData({
            all,
            wrong,
            questionAnalysis,
            rate,
            success: status === 1
          })
        }
      },
      fail: function (res) {
      }
    })
  },
  backToDetail: function() {
    let { id } = this.data;
    // 
    wx.navigateTo({
      url: '../healthKnowledge/index?id=' + id,
    })
  }
})