
import { wxAjax } from "../../utils/util";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imagesUrl,
    type: '',
    level: '',
    imagineLink: '',
    firstTitleCn: '',
    secondTitleCn: '',
    descriptionCn: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 银 2 
    let {level, type} = JSON.parse(options.params);
    this.setData({level, type})
    this.getCouponInfo();
  },
  getCouponInfo: function () {
    let that = this;
    let { level, type} = this.data;
    let url = app.globalData.baseUrl + "/remote/discount/timeLimit";
    wxAjax('GET', url, {type: 2}).then((res) => {
      if (res.data.code === 200 && res.data.data) {
        let { imagineLink, firstTitleCn, secondTitleCn, descriptionCn, id } = res.data.data;
        that.setData({
          imagineLink,
          firstTitleCn,
          secondTitleCn,
          descriptionCn,
          id
        })
      }
    });
  },
  goStrategy: function() {
    wx.navigateTo({ url: '../../pages/strategy/index'});
  },
  goDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/couponDetails/index?id='+ id,
    })
  }
})