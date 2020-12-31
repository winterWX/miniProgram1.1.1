import { wxAjax } from "../../utils/util";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.imagesUrl,
    secore:[],
    secoreNun:0,
    activeNum:0,
    bluPosse:0,
    activeData:{},
    LockFlg : true,
    indicatorColor:'#EDEDED',
    indicatorActive:"#929292",
    indicatorDots: true,
    vertical: true,
    autoplay: true,
    interval: 2000,
    duration: 500,
    showCarkBlock:false,
    indexNum: -1,
    receiveId: -1,
    integral: 0,
    showModal: false,
    modalContent: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.tierMytier();
  },
  onHide: function() {
    this.setData({showCarkBlock: false});
  },
  tierMytier:function(){
    let that = this;
    let url = app.globalData.baseUrl + '/remote/tier/mytier';
    that.selectComponent("#loading").show();
    wxAjax('GET', url).then(res => {
      if (res.data.code == 200) {
          let sercode = res.data.data.mileStones.length;
          res.data.data.mileStones = res.data.data.mileStones.map(item=>{
              return {
                  ...item,
                  expiryTime: item.expiryTime ? that.cardDayShow(item.expiryTime) :''
              }
          })
          that.setData({
              activeData : res.data.data,
              activeNum :  sercode,
              bluPosse : that.bluPosse(res.data.data),
              secoreNun : (100 / Number(sercode)).toFixed(2)
          })
      }
      that.selectComponent("#loading").hide();
    })
  },

  bluPosse:function(data){
      let { integral, mileStones } = data;
      let mileStonesIntegral = mileStones.map (item => {
        return item.targetIntegral;
      });
      this.setData({integral});
      let originData = JSON.parse(JSON.stringify(mileStonesIntegral));
      let min = Math.min(...mileStonesIntegral);
      let max = Math.max(...mileStonesIntegral);
      let result = 0;
      if (integral < min) {
        result = integral > 0 ? 2.6 : 0;
      } else if (integral > max) {
        result = 100;
      } else {
        let index;
        
        if(originData.includes(integral)) {
          index = originData.indexOf(integral) + 1;
          result = (index / originData.length).toFixed(2) * 100;
        } else {
          mileStonesIntegral.push(integral);
          mileStonesIntegral.sort((a, b) => {
              return a - b;
          });
          index = mileStonesIntegral.indexOf(integral);
          result = (index / originData.length).toFixed(2) * 100;
        }
      }
      return result;
  },

  cardClick:function(e){
    let that = this;
    let {dataset: { index, prop}} = e.currentTarget;
      if(prop.received == 1){
         wx.navigateTo({
            url: `../../pages/couponDetails/index?id=${prop.id}&flag=1`,
         })
      }else if(prop.received == 2){
         that.receivedFun(index);
      }else{
         that.openCardModial(prop);
      }
  },

  receivedFun:function(indexNum){
    let that = this;
    let idCode = that.data.activeData.mileStones[indexNum].id;
    that.setData({indexNum:indexNum});
    let url = app.globalData.baseUrl + '/remote/tier/reward/receive?id='+ idCode;
    that.selectComponent("#loading").show();
    wxAjax('GET', url).then((res) => {
      if (res.data.code == 200) {
          that.tierMytier();
          that.setData({showCarkBlock:true,receiveId:res.data.data});
      }
      that.selectComponent("#loading").hide();
    });
  },

  openCardModial: function(prop) {
    this.setData({showModal: true, modalContent: prop});
  },

  parentCallBack:function(event){
    let that = this;
    if(that.data.activeData.level === 1){
        that.lockLevelFirst(event);
    }else if(that.data.activeData.level === 2){
        that.lockLeveLast(event);
    }else if(that.data.activeData.level === 4){
        that.lockLeveLast(event);
    }
  },

  lockLevelFirst:function(event){
      let that = this;
      if (event.detail.LockLevel === 1){
          that.setData({ silverLevel: false, glodLevel: false, LockFlg: true});
      }else if (event.detail.LockLevel === 2){
          that.setData({silverLevel: true, glodLevel: false, LockFlg: false});
      }else if(event.detail.LockLevel === 3){
          that.setData({glodLevel: true, silverLevel: false, LockFlg: false });
      }
  },

  lockLeveLast:function(event){
    let that = this;
    if (event.detail.LockLevel === 2){
        that.setData({silverLevel: false, glodLevel: false, LockFlg: true});
    }else if(event.detail.LockLevel === 3){
        that.setData({glodLevel: true, silverLevel: false, LockFlg: false });
    }
  },

  bindEmail:function(){
      let that = this;
      wx.navigateTo({
        url: '../../pages/couponDetails/index?id='+ that.data.receiveId,
      })
  },

  closeBolck:function(){
    let that = this;
    that.setData({showCarkBlock: false});
  },

  cardDayShow:function(value){
    const date = new Date(value * 1000); 
    const Y = date.getFullYear() + '年';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
    return  Y + M + D;
  },

  //积分翻倍
  doubleIntegral:function(e){
      let { dataset :{ level, flg } } = e.currentTarget;
      let data = {
          level: level === undefined ? '' : level,
          flg: flg === undefined ? '' : flg
      }
      let params = JSON.stringify(data);
      console.log('params',params);
      wx.navigateTo({
        url: `../../pages/integralRule/index?params=${params}`
      })
  },

  //内容特权
  contentPrivilege:function(e){
      let level = e.currentTarget.dataset.level;
      wx.navigateTo({
        url: `../../pages/contentsInterests/index?level=${level}`
      })
  },

  toPreferentialService: function(e) {
      let params = {
          level: e.currentTarget.dataset.level,
          type: e.currentTarget.dataset.type,
          lockFlg: this.data.LockFlg
      } 
      let sendData = JSON.stringify(params);
      wx.navigateTo({
        url: `../preferential/index?params=${sendData}`
      })
  },

  upgradePage:function(){
      wx.navigateTo({
        url: '../../pages/membership/index',
      })
  },

  closeModal: function() {
    this.setData({showModal: false});
  }
})