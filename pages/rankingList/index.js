import { wxAjax } from "../../utils/util";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    self: {},
    friend: [],
    avatarObjList: [
      {
        url: app.globalData.imagesUrl + '/images/icon/icon-defult-touxiang.png',
        id: 13
      }, {
        url: app.globalData.imagesUrl + '/images/icon/icon-laoshu.png',
        id: 1
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconNiu.png',
        id: 2
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconLaohu.png',
        id: 3
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconTuzi.png',
        id: 4
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconLong.png',
        id: 5
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconShe.png',
        id: 6
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconMa.png',
        id: 7
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconYang.png',
        id: 8
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconHouzi.png',
        id: 9
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconJi.png',
        id: 10
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconGou.png',
        id: 11
      }, {
        url: app.globalData.imagesUrl + '/images/icon/iconZhu.png',
        id: 12
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getRankList: function() {
    let that = this;
    let url = app.globalData.baseUrl + '/remote/leaderboard/friend/board';
    wxAjax('GET', url).then(res => {
      wx.hideToast();
        if (res.data.code == 200) {
          let { myBoardVo, friendLeaderBoardVo} = res.data.data;
          that.setData({
            self: myBoardVo,
            friend: friendLeaderBoardVo
          })
        }
    });
  }
})