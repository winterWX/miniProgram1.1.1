const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeData: {
      type: Object,
      observer(value) {              
        if (Object.keys(value).length !== 0){
            this.cardTopShow(value);
            this.cardDayShow(value);
        } 
      }
    },
    infoLevel: {
      type: Object,
      observer(value) {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
      touch:{
        startX:0,
        startY:0,
        endX:0,
        endY:0
      },
      leftImage:0,
      imageFlg:false,
      levelExpiryTime:'',
      nextLevelIntegral:'',
      seliverBlockShow : true,
      windowWidth: wx.getSystemInfoSync().windowWidth*2,
      infoLevelObj:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cardTopShow(value){
      if(value.level === 2 || value.level === 4){
          this.setData({leftImage: -680});
      }else if(value.level === 3 || value.level === 5){
          this.setData({leftImage: -1330});
          this.setData({imageFlg: true});
      }
    },
    touchStart(e){
        this.setData({
          "touch.startX": e.changedTouches[0].clientX,
          "touch.startY": e.changedTouches[0].clientY
        });
        console.log('startX',this.data.touch.startX);
    },
    touchEnd(e) {
      let imageFlg = e.currentTarget.dataset.id;
      let stopeClick = e.target.dataset.card;
      if(stopeClick === 'stopeClick'){
           return;
      }else{
        this.setData({
          "touch.endX": e.changedTouches[0].clientX,
          "touch.endY": e.changedTouches[0].clientY
        });
        this.imageLeft(imageFlg,this.data.touch.endX);
      }
    },
    imageLeft:function(imageFlg,endX){
      console.log('endXendXendX',endX);
      if(Number(this.data.touch.startX) !== Number(endX)){
          if(imageFlg === 'image1' && endX > 30){
              this.setData({leftImage: -680});
              this.searchLeve(2);
          }else if(imageFlg === 'image2' && endX > 20){
              this.setData({leftImage: -1330,imageFlg: true});
              this.searchLeve(3);
          }else if(this.data.activeData.level === 1 && (imageFlg === 'image3' && endX > 140)){
              this.setData({leftImage: -680,imageFlg: false});
              this.searchLeve(2);
          }
      }else{
          return;
      }
    },
    upgradeCard:function(e){
      console.log('0------------------')
      let cardUp = e.target.dataset.card;
      wx.navigateTo({
        url: '../../pages/membership/index',
      })
    },
    cardDayShow:function(value){
        const date = new Date(value.levelExpiryTime * 1000); 
        const Y = date.getFullYear() + '年';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
        const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
        this.setData({levelExpiryTime: Y + M + D});
    },
    searchLeve:function(level){
      if(this.data.activeData.level === 1 || this.data.activeData.level === 2){
         this.infoLevel(level);
         this.setData({seliverBlockShow: false})
         this.triggerEvent('parentLevel', {
              LockLevel: level
         }, {})
      }else{
        return;
      }
    },
    infoLevel:function(level){
      let that = this;
      wx.request({
        url: app.globalData.baseUrl + '/remote/tier/info?level='+ level,
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token
        },
        success: function (res) {
          if (res.data.code == 200) {
              that.setData({infoLevelObj:res.data.data})
           }
        },
        fail: function (res) {
          console.log('.........fail..........');
        }
      })
    }
  }
})
