const app = getApp();
Page({
  data: {
    listData:[],
    timeData:[],
    inputSearchData:'',
    tabCur: 0, //默认选中
    tabLists: [],  //东部导航tag
    topTipShow: true,
    collectFlg:false,
    hideModal: true,     //模态框的状态  true-隐藏  false-显示
    animationData: {},
    sizeData: 4,
    myTagData: [{ tag: "热面" }, { tag: "方便面" }, { tag: "222"}],    //我关注的话题
    forYouData:[],   //全部话题
    editSwith: true,
    editStute: false,
    dataItemTag :[],
    researchTag:'',
    statusTy:[],
    topTitleIndex:-1,
    articleAdd: false,
    selectCollData:[],
    deleteTagArray:[],
    addTagArray:[],
    listId:[]
  },
  onLoad: function (options) {
    let that = this;
    // 控制close按钮，页面初始的时候
    let topTipShowFlg = app.healthInforData.findMore
    that.setData({
      topTipShow: topTipShowFlg
    })
    that.mytagSearch();
    that.searchSend(options.inputVal);
      //查询所有话题
     that.searchAllTopic();
  },
  bindKeyInput: function(e){
    var inputNameData = e.detail.value
    this.setData({
        inputSearchData: inputNameData
     });
  },
  //选择条目
  tabSelect(e) {
      var that = this;
      that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 2) * 200
      })
      that.setData({
         researchTag: that.data.tabLists[e.currentTarget.dataset.id].tag
      })
      //console.log('researchTag', that.data.researchTag);
      that.searchSend(that.data.researchTag);
  },
  listClick(e){
     let goodsId = e.currentTarget.dataset.itemid;      
      wx.navigateTo({                                 
        url: '../../pages/HealthInforDetails/index?goodsId='+ goodsId      
      })
  },
  //文章列表接口
  searchSend(parase){
    var that = this;
    wx.request({
     url: app.globalData.baseUrl + '/remote/article/query/list',
     data:{
      "currentPage": 1,
      "pageSize": 10,
      "topic": parase
    },
    method:"POST",
     header:{
       'Content-Type':'application/json'
     },
    success: function (res) {
       if(res.data.data !== null){
        console.log('remote/article/query/list',res);
        //that.collectionQueryCounts();  // 赋值前调用
        res.data.data.forEach((item)=>{
          item.inputtime = that.timestampToTime(item.inputtime)
         })
          that.setData({
            listData: res.data.data
          })
        console.log('listDatalistData',that.data.listData);
       }
    },
    fail: function (res) {
      console.log('.........fail..........');
    }
    })
  },
  collectionImageShare:function(e){
      var that = this;
      var articleId = e.currentTarget.dataset.id;
      var node = that.data.listData.findIndex(item=>{
         return item.id === articleId
      })
      if(node >-1){
          that.setData({
            topTitleIndex : node
          })
      }
      if(!that.data.listData[node].isCollect){
        that.collectionAdd(articleId);
      }else{
        that.collectionDetele(articleId);
      }
  },
  editActList:function(){
    var that= this;
    that.setData({
      editStute: true
    })
    that.setData({
      editSwith: false
    })
  },
  canlenBtn:function () {
    var that = this;
    that.setData({
      editStute: false
    })
  },
  editTagDone:function() {
    let that = this;
    let listParas =[];
    // that.setData({
    //   editStute: false
    // })
    if(that.data.myTagData.length > 0){
      that.data.myTagData.forEach((item,index)=>{
          listParas.push(
                {
                  order: index +'',
                  topic: item.tag
                }
            )
      })
    }
    // that.setData({
    //   tabLists:that.data.myTagData
    // })
    that.refreTagList(listParas);  //批量编辑
  },
  tagsShare:function () {
      var that = this;
      that.setData({
        hideModal: false
      })
      var animation = wx.createAnimation({
        duration: 100,//动画的持续时间 默认600ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      setTimeout(function () {
        that.fadeIn();  //调用显示动画
      }, 100)
      that.setData({
        editStute:true
      })
  },
  //查询所有话题
  searchAllTopic:function () {
      var that = this;
      wx.request({
      url: app.globalData.baseUrl + '/remote/myTopic/searchAllTopic',
      method:"GET",
       header:{
         'Content-Type':'application/json',
         'token':app.globalData.token
       },
       success: function (res) {
        let searchAllTopicArray =[];
        if(res.data.data !== null){
          res.data.data.forEach(item =>{
            searchAllTopicArray.push({
              tag: item.name 
            })
          })
          that.setData({
            forYouData: searchAllTopicArray
          })
          console.log('searchAllTopic', that.data.forYouData);
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
      })
    },
  //查询我的话题  
  mytagSearch:function () {
      var that = this;
      wx.request({
      url: app.globalData.baseUrl + '/remote/myTopic/search',
      method:"GET",
       header:{
         'Content-Type':'application/json',
         'token':app.globalData.token
       },
       success: function (res) {
         if (res.data.data !== null){
            if (Array.isArray(res.data.data) && res.data.data.length > 0){
                  let tabListsArray = [];
                  res.data.data.forEach(item => {
                    tabListsArray.push({
                      tag: item.topic
                    })
                  })
                  that.setData({
                    tabLists: tabListsArray
                  })
                  that.setData({
                    myTagData: tabListsArray   //我关注的话题
                  })
            }else{
                let tabListsArray = [];
                tabListsArray.push({tag:res.data.data.topic});
                that.setData({
                  tabLists: tabListsArray
                })
                that.setData({
                  myTagData: tabListsArray   //我关注的话题
                })
            }
         }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
      })
    },
  //批量更新tag  
  refreTagList:function(listNum){
            var that = this;
            wx.request({
              url: app.globalData.baseUrl +'/remote/myTopic/batchUpdateMyTopic',
              method:"POST",
              data:{list: listNum},
              header:{
                'Content-Type':'application/json',
                'token':app.globalData.token
              },
              success: function (res) {
                that.mytagSearch(); //批量编辑成功后刷新顶部导航
                that.closePage();  //关闭编辑页面
              },
              fail: function (res) {
                console.log('.........fail..........');
              }
      })
    },
  myTagItemFun:function (e) {
      let that = this;
      let clickIndex = e.currentTarget.dataset.index;
      let myTagFilter = that.data.myTagData;
        that.data.deleteTagArray.push(myTagFilter[clickIndex])
      let conceArray = [...that.data.forYouData,...that.data.deleteTagArray];
      let curArray = conceArray.reduce((acc, cur) => {
          !acc.some(v => v.tag === cur.tag) && acc.push(cur);
          return acc;
        }, []);
        that.setData({
           forYouData: curArray
        })
        that.setData({
          deleteTagArray:[]
        })
        let myTagFilterNewArray = myTagFilter.filter(item => item.tag !==                                                     that.data.myTagData[clickIndex].tag);
        that.setData({
          myTagData: myTagFilterNewArray
        })
    },
  addTagBbtn:function(e){
    console.log('forYouData +add',this.data.forYouData);
      let that = this;
      let clickIndex = e.currentTarget.dataset.index;
      let addBtn = that.data.forYouData;
      that.data.addTagArray.push(addBtn[clickIndex])
      let arrayOld = [...that.data.myTagData,...that.data.addTagArray]
      let ccArray = arrayOld.reduce((acc, cur) => {
        !acc.some(v => v.tag === cur.tag) && acc.push(cur);
        return acc;
      }, []);
      that.setData({
        myTagData: ccArray
      })
      that.setData({
          addTagArray:[]
      })
    let addBtnNewArray = addBtn.filter(item => item.tag !== that.data.forYouData[clickIndex].tag);
        that.setData({
            forYouData: addBtnNewArray
      })
    },
    // 隐藏遮罩层
    hideModal: function () {
      var that = this;
      var animation = wx.createAnimation({
        duration: 100,  //动画的持续时间 默认800ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',  //动画的效果 默认值是linear
      })
      this.animation = animation
      that.fadeDown();//调用隐藏动画   
      setTimeout(function () {
        that.setData({
          hideModal: true
        })
      }, 100)  //先执行下滑动画，再隐藏模块
    },
    //动画集
    fadeIn: function () {
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export()  //动画实例的export方法导出动画数据传递给组件的animation属性
      })
    },
    fadeDown: function () {
      this.animation.translateY(1000).step()
      this.setData({
        animationData: this.animation.export(),
      })
      this.setData({
        editStute:false
      })
      this.setData({
        editSwith: true
      })
    },
    closePage:function(){
      var that =this;
      that.fadeDown();
      that.setData({
         hideModal: true
      })
    },
    searchBlock:function(){
      wx.navigateTo({
        url: '../../pages/searchTag/index',
      })
    },
    topTipImageColse:function(){
      let that = this;
      app.healthInforData.findMore = false;
      let topTipShowFlg = app.healthInforData.findMore = false
      that.setData({
        topTipShow: topTipShowFlg
      })
    },
    timestampToTime :function (timestamp){
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y + M + D + '，' + h + m;
    },
})