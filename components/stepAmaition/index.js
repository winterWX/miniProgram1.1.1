// components/stepAmaition/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stepNum: {
      type: Number,
      value: 0,
      observer(value) {
        setTimeout(()=>{
            this.startAmation()
          },100)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num:0,
    clip:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    startAmation() {
    
      var timer = null;
      var num = 0;
      var clip = 0
      var counterNumber = () => {
        num = num + 500
        if (num > this.data.stepNum-500) {
          clearInterval(timer)
          this.setData({
            num: this.data.stepNum,
            clip:380,
            animateCompelte: true,
          })          
        } else {
          var clip = 0
          for (var i = 0; i < num; i++) {
            clip = clip+ num / this.data.stepNum*370*0.001
          }
          console.log(clip)
          this.setData({
            num:num,
            clip: clip
          })
        }

      }
      timer = setInterval(counterNumber, 180)
    },
  }
})
