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
          },500)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    num:0,
    clip:0,
    targetSteps:10000
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
            animateCompelte: true,
          })          
        } else {
          this.setData({
            num:num,
            clip: clip
          })
        }

      }
      var clip = 0
      if (this.data.stepNum > this.data.targetSteps || this.data.stepNum == this.data.targetSteps) {
        clip = 380
      } else {
        clip = this.data.stepNum / this.data.targetSteps * 380
        if (clip<30){
          clip=30
        }
      }
      this.setData({       
        clip: clip
      })
      timer = setInterval(counterNumber, 50)
    },
  }
})
