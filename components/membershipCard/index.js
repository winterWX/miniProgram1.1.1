Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    imageFlg:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e){
      console.log('touchStart',e)
      this.setData({
        "touch.startX": e.changedTouches[0].clientX,
        "touch.startY": e.changedTouches[0].clientY
      });
      console.log('startX',this.data.touch.startX);
    },
    touchEnd(e) {
      console.log('touchEnd',e)
      let imageFlg = e.currentTarget.dataset.id;
      this.setData({
        "touch.endX": e.changedTouches[0].clientX,
        "touch.endY": e.changedTouches[0].clientY
      });
      this.imageLeft(imageFlg,this.data.touch.endX);
    },
    imageLeft:function(imageFlg,endX){
      if(Number(this.data.touch.startX) !== Number(endX)){
        console.log('endX',endX)
        if(imageFlg === 'image1' && endX > 30){
          this.setData({leftImage: -680});
        }else if(imageFlg === 'image2' && endX > 20){
          this.setData({leftImage: -1330});
          this.setData({imageFlg: true});
        }
      }else{
        return
      }
    }
  }
})
