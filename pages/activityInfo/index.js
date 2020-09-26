let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    detail: {},
    code: '',
    isJoin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id = '', title = '活动详情'} = options;
    let activityId = id;
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({ activityId });
    this.getActivityDetail(activityId);
  },
  getActivityDetail: function (id) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/myactivity/detail/' + id,
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 200) {
          let detail = {
            ...res.data.data,
            content: res.data.data.content,
            ruledescription: res.data.data.ruledescription
          };
          detail.mileStoneVo.unshift({
            reward: 0,
            mileStoneTarget: 0,
            received: 5
          });
          let isJoin = detail.isJoinStatus === '2';
          that.setData({ detail, isJoin });
        }
      },
      fail: function (res) {
      }
    })
  }
})