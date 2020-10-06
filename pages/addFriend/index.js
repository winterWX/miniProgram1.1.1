const app = getApp();
import pinyin from "wl-pinyin"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitData:{},
    //排序
    listData: [],
		searchValue: '',
		emptyShow: false,
    topSize: 100,
    baseUrl: app.globalData.imagesUrl,
    friendArrayData:[],
    avatarObjList: [
      {
        url:  app.globalData.imagesUrl + '/images/icon/icon-laoshu.png',
        id: 1
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconNiu.png',
        id: 2
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconLaohu.png',
        id: 3
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconTuzi.png',
        id: 4
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconLong.png',
        id: 5
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconShe.png',
        id: 6
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconMa.png',
        id: 7
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconYang.png',
        id: 8
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconHouzi.png',
        id: 9
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconJi.png',
        id: 10
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconGou.png',
        id: 11
      }, {
        url:  app.globalData.imagesUrl + '/images/icon/iconZhu.png',
        id: 12
      },
      {
        url: app.globalData.imagesUrl + '/images/pagePng/icon-defult-touxiang.png',
        id: 13
      }, 
    ],
    arrayNum: '',
    redTag: 0,
    redTagShow:false,
    bottomHight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.topHeight();
     this.inviteCode();
     this.hasAddFriend();
     this.newFriendList();
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
    this.inviteCode();
    this.topHeight();
    this.hasAddFriend();
    this.newFriendList();
    this.setData({searchValue:''});
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
      let that = this;
      wx.showNavigationBarLoading();         //在当前页面显示导航条加载动画
      that.hasAddFriend();
      that.newFriendList();
      setTimeout(function(){
          wx.hideNavigationBarLoading();     //在当前页面隐藏导航条加载动画
          wx.stopPullDownRefresh();          //停止下拉动作
      },1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  newFriend:function(){
    wx.navigateTo({
      url: '../../pages/newFriend/index',
    })
  },
  //邀请码  
  inviteCode: function () {
      let that = this;
      wx.request({
        url: app.globalData.baseUrl + '/remote/invite/invitationcode',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          'token': app.globalData.token
        },
        success: function (res) {
            if(res.data.code === 200){
                if(res.data.data.invitationList.length > 0){
                    res.data.data.invitationList.forEach( v => {
                        let reg = /^(\d{3})\d{4}(\d{4})$/;
                        v.phoneNumber = v.phoneNumber.replace(reg, "$1****$2");
                    })
                    res.data.data.personNum = res.data.data.invitationList.length;
                }
                app.globalData.invitationCode = res.data.data.invitationCode;
                that.setData({  
                  invitData: res.data.data
                })
            }
        },
        fail: function (res) {
          console.log('.........fail..........');
        }
      })
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    app.globalData.userInfo.invitationCode = this.data.invitData.invitationCode;
    let userInfoData = JSON.stringify(app.globalData.userInfo);
    console.log('userInfoData---------',userInfoData);
    let shareObj = {
  　　　　title: "邀请好友注册领好礼",
  　　　　path: "/pages/newFriend/index?userInfoData="+ userInfoData,
         imageUrl: "http://106.54.73.125:8104/images/miniprogram/images/addFriend/img@3x.png",
  　　}
  　　// 来自页面内的按钮的转发
  　　if (options.from == "button") {
    　　　　return shareObj;
  　　}
  　　return shareObj;
  },
  topHeight:function(){
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#topHeight').boundingClientRect()
    query.exec(function (res) {
      //取高度
      let topViewHeight = res[0].height
      let windowHeight = wx.getSystemInfoSync().windowHeight;
      let bottomHight = (windowHeight - topViewHeight)*2
      that.setData({bottomHight})
    })
  },
  hasAddFriend:function(){
    let that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/friend',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
          if(res.data.code === 200){
            let friendArrayData = that.arryFriend(res.data.data);
            that.setData({friendArrayData:friendArrayData})
            that.setList(that.formatList(that.data.friendArrayData));
          }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  //新的好友
  newFriendList:function(){
    var that = this;
    wx.request({
      url: app.globalData.baseUrl +'/remote/friend/apply',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
          if(res.data.code === 200){
            let numlength = res.data.data.length;
            that.setData({ redTagShow: numlength > 0 ? true : false});
            that.setData({ redTag: numlength });
          }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  //排序代码
  formatList(list) {
		let tempArr = [];
		["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"].forEach(initial => {
			let tempObj = {};
			tempObj.key = initial;
			tempObj.data = list.filter(item => item.initial == initial).map(item => {
				return {avatar:item.avatar,name:item.nickname,short: item.short}
			});

			if(tempObj.data && tempObj.data.length > 0) {
				tempArr.push(tempObj);
			}
		})
		return tempArr;
	},
  onFocusInput(){
     wx.navigateTo({
        url: '../friendSearch/index',
     })
  },
	setList(listData) {
		let emptyShow = listData.length == 0 ? true : false;
		this.setData({
			listData: listData,
			emptyShow: emptyShow
    });
	},
	itemClick(e) {
		console.log(e);
  },
  arryFriend:function(allData){
      let lastArryData = allData.map((item,index)=>{
          return {
            avatar: this.avatarSelect(item.avatar,item.avatarUrl),
            nickname: item.nickname,
            mobile: item.mobile,
            initial: pinyin.getFirstLetter(item.nickname).slice(0,1).toUpperCase(),
            short: pinyin.getPinyin(item.nickname).replace(/\s+/g,"")
          }
      })
      this.setData({
          arrayNum: `(${lastArryData.length})`
      })
      return lastArryData;
  },
  avatarSelect:function(avatar,avatarUrl){
    if(avatar !==''){
        return this.data.avatarObjList[Number(avatar)-Number(1)].url;
    }else if(avatar ==='' && avatarUrl !==''){
        return avatarUrl;
    }else{
        return this.data.avatarObjList[12].url;
    }
  }
})