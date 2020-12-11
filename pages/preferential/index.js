
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
    id: '',
    lockFlg: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {level, type, lockFlg} = JSON.parse(options.params);
    this.setData({level, type, lockFlg})
    this.getCouponInfo();
  },
  getCouponInfo: function () {
    let that = this;
    let { level, type } = this.data;
    let url = app.globalData.baseUrl + "/remote/discount/timeLimit";
    wxAjax('GET', url, {type}).then((res) => {
      if (res.data.code === 200 && res.data.data) {
        let { imagineLink, firstTitleCn, secondTitleCn, descriptionCn, id } = res.data.data;
        wx.setNavigationBarTitle({
          title: firstTitleCn
        })
        that.setData({
          imagineLink,
          firstTitleCn,
          secondTitleCn,
          descriptionCn: descriptionCn.replace(/<[^>]+>/g,""),
          id
        })
      }
    });
  },
  goStrategy: function() {
    let { level } = this.data;
    let url = '../../pages/strategy/index';
    if (level == 2) {
      url = '../../pages/goldStrategy/index';
    }
    wx.navigateTo({ url });
  },
  goDetail: function(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/couponDetails/index?id='+ id,
    })
  }
})