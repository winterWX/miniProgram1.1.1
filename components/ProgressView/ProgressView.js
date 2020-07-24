let app = getApp();
let windWidth = wx.getSystemInfoSync().windowWidth; //屏幕宽度
const xs = windWidth / 750;
Component({
  properties: {
    lineWidth: {
      type: Number,
      value: 20
    },
    lineColor: {
      type: String,
      value: "#00a865"
    },
    bottomColor: {
      type: String,
      value: "#cccccc"
    },
    width: {
      type: Number,
      value: 320
    },
    height: {
      type: String,
      value: 320
    },
    todayStepNum: {
      type: Number,
      value: 0    
    }
  },
  data: {
    ctx: null
  },
  /**
   * 组件的方法列表
   */
  methods: {
    drawProgressBar() {
      let stepsNumObject = wx.getStorageSync("stepsNumObject");
      this.setData({
        todayStepNum: stepsNumObject.todaySteps
      })
      console.log('this.data.todayStepNum',this.data.todayStepNum);
      //作画
      let bottomColor = this.data.bottomColor //进度条底色
      let lineColor = this.data.lineColor; //线条颜色
      let lineWidth = this.data.lineWidth * xs; //线条宽度
      let widthCir = this.data.width * xs;  //半径不算线的宽度
      let heightCir = this.data.height * xs - lineWidth;
      //获取canvas 的绘图上下文
      let ctx = this.data.ctx
      if (!ctx) {
        ctx = wx.createCanvasContext("circleBar", this);  //创建 canvas 的绘图上下文 CanvasContext 对象
        this.setData({
          ctx: ctx
        })
      }
      ctx.translate( widthCir/2,  heightCir/2);
      console.log('widthCir/2',widthCir/2);
      //绘制底色圆弧
        ctx.beginPath();//开始创建一个路径
        ctx.setStrokeStyle(bottomColor);//设置描边颜色
        ctx.setLineWidth(lineWidth);//设置线条的宽度
        ctx.arc(0, 0, widthCir/2 - lineWidth, Math.PI / 180 * 0, Math.PI / 180*180);//创建一条弧线
        ctx.setLineCap('round') //末端圆弧
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
       // ctx.font="28rpx PingFangSC";
        ctx.fillStyle='#767676';
        ctx.fillText('今日步数', 0, -20);
        ctx.font="30rpx Flama";
        ctx.fillStyle='#333333';
        //ctx.fillText(this.data.todayStepNum, 0, 8)
        ctx.fillText(10000, 0, 8);
        ctx.stroke(); //画出当前路径的边框
        ctx.closePath(); //关闭一个路径
        //当前进度的圆弧
        ctx.beginPath();//开始创建一个路径
        ctx.setStrokeStyle(lineColor);//设置描边颜色
        ctx.setLineWidth(lineWidth);//设置线条的宽度
        ctx.arc(0, 0, widthCir/2-lineWidth, Math.PI / 180 * 180, Math.PI / 180 * 0,true);//创建一条弧线
        ctx.setLineCap('round') //末端圆弧
        ctx.stroke(); //画出当前路径的边框
        ctx.closePath(); //关闭一个路径
        ctx.draw();  //清空上次内容绘制本次内容
    }
  }
})