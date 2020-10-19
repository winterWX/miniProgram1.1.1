const app = getApp();
import { formatNumber, formatTime } from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    integralList:{},
    integral: 0,
    expiryTime: '',
    detailArray:[],
    typeList:[
      "表示如果每天完成目标步数,可以领的积分",
      "表示如果连续7天都完成目标步数,第7天领的积分",
      "表示如果连续28天都完成目标步数,第28天领的积分",
      "注册时，使用邀请码邀请成功奖励的积分",
      "个人资料完善度为100%时奖励的积分",
      "完成步数授权获取的积分",
      "用户成功扫描完二维码可领取的积分(用于用户在银行开户成功,线下扫码)",
      "活动挑战里程碑积分",
      "每日读文章获取的积分",
      "新用户注册奖励积分",
      "医疗服务",
      "视频会诊",
      "eShop购物",
      "购买保险",
      "健康测试"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage();
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
  integralRules:function(){
    wx.navigateTo({
        url: '../../pages/integralRules/index',
    })
  },
  initPage:function(){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/integral/detail',
      method: "GET",
      header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
      },
      success: function (res) {
        if(res.data.code === 200){
           let {integral,expiryTime,detail} = res.data.data;
           const detailArray = detail.map(item=>{
              return {
                    createTime : that.timestampToTime(item.createTime),
                    integral: item.integral,
                    type : that.data.typeList[item.type- 1]
                }
            })
            that.setData({
              integral,
              expiryTime: that.cardDayShow(expiryTime),
              detailArray : detailArray
           });
            console.log('detailArraydetailArray.detailArray.detailArray====',that.data.detailArray);
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  cardDayShow:function(value){
      const date = new Date(value * 1000); 
      const Y = date.getFullYear() + '年';
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
      const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
      return  Y + M + D;
  },
  timestampToTime :function (timestamp){
        const date = new Date(timestamp * 1000);  //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const Y = date.getFullYear() + '年';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
        const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        const s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + ' ' + h + m + s;
  }
})