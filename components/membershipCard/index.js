// components/membershipCard/index.js
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
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e){
      this.setData({
        "touch.startX": e.changedTouches[0].clientX,
        "touch.startY": e.changedTouches[0].clientY
      });
    },
    touchEnd(e) {
      this.setData({
        "touch.endX": e.changedTouches[0].clientX,
        "touch.endY": e.changedTouches[0].clientY
      });
    }
  }
})
