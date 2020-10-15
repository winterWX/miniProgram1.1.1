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
      windowWidth: 100+'%',
      infoLevelObj:{},
      duration: 500,
      paddingLeft:0,
      currentNum: -1,
      prevFlg: 0,
      nextFlg: 0,
      prevFlgSeconde: 0,
      nextFlgSeconde: 0,
      levelSecondeFour:false,
      levelFive:false,
      fristCaredShow:false,
      secondeCardShow:false,
      threeCardShow:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cardTopShow(value){
      if(value.level === 1){
          this.setData({fristCaredShow:true});
          this.setData({ currentNum: 0,prevFlg: 36, nextFlg: 40});
      }else if(value.level === 2 || value.level === 4){
          this.setData({levelSecondeFour:true});
          this.setData({ currentNum: 0,prevFlgSeconde: 40, nextFlgSeconde: 40});
      }
    },
    cardChange(event){
        let cardNum = event.detail.current;
        if(cardNum === 0){
            this.setData({fristCaredShow:true,secondeCardShow:false});
        }else if(cardNum === 1){
            this.setData({secondeCardShow:true,fristCaredShow:false,threeCardShow:false});
        }else if(cardNum === 2){
            this.setData({threeCardShow:true,secondeCardShow:false,fristCaredShow:false});
        }
        this.searchLeve(cardNum + 1);
    },
    cardChangeSeconde:function(event){
        let cardNum = event.detail.current;
        if(cardNum === 0){
           // this.setData({prevFlgSeconde: 20, nextFlgSeconde: 20});
           this.setData({prevFlgSeconde: 40, nextFlgSeconde: 40});
           this.setData({levelSecondeFour: true});
           this.setData({levelFive: false});
        }else if(cardNum === 1){
            //this.setData({prevFlgSeconde: 32, nextFlgSeconde: 10});
            this.setData({prevFlgSeconde: 64, nextFlgSeconde: 20});
            this.setData({levelFive: true});
            this.setData({levelSecondeFour: false});
        }
        this.searchLeve(cardNum + 2);
    },
    upgradeCard:function(e){
      let that = this;
      let cardUp = e.target.dataset.card;
      let cardShow = [1,2,4];
      if(cardUp === 'image2' && that.data.activeData.level === 1){
          return;
      }else if(cardUp === 'image3' && cardShow.includes(that.data.activeData.level)){
          return;
      }else{
        wx.navigateTo({
          url: '../../pages/membership/index',
        })
      }
    },
    searchLeve:function(level){
      if(this.data.activeData.level === 1 || this.data.activeData.level === 2 || this.data.activeData.level === 4){
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
    },
    intergRalDatails:function(){
        wx.navigateTo({
            url: '../../pages/integralDetails/index',
        })
    },
    myCoupons:function(){
      wx.navigateTo({
          url: '../../pages/myCoupons/index',
      })
    },
    cardDayShow:function(value){
      const date = new Date(value.levelExpiryTime * 1000); 
      const Y = date.getFullYear() + '年';
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
      const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
      this.setData({levelExpiryTime: Y + M + D});
    }
  }
})
