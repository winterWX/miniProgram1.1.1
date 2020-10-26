var timer = null;
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        stepNum: {
            type: Number,
            value: 0,
            observer(value) {
               console.log('value',value);
               clearInterval(timer);
               const query = this.createSelectorQuery()
               query.select('#ring').boundingClientRect(res => {
                     this.drawRing('ring', res.width, res.height,value);
               }).exec()
               // this.anmitionRic(value);
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
       numStep :0
    },
    ready: function () {
        const query = this.createSelectorQuery()
        query.select('#ringTop').boundingClientRect(res => {
            this.topDrawRing('ringTop', res.width, res.height)
        }).exec()
    },

    /**
     * 组件的方法列表
     */
    methods: {
        topDrawRing: function(canvasId, width, height){
            var context = wx.createCanvasContext(canvasId, this)
            // 外层圆环
            context.beginPath()
            context.arc(width / 2, 40, width / 2 - 70, 1 * Math.PI, 2 * Math.PI,true)
            context.setLineWidth(12)
            context.setLineCap('round')
            context.setStrokeStyle('#ebeeeb')
            context.textAlign = 'center' //文字居中
            context.font = '16px Arial'
            context.fillStyle = '#7D7D7D' //字体颜色
            context.fillText('今日步数',width / 2,22)
            context.stroke()
            context.draw()
        },
        drawRing: function (canvasId, width, height,stepNum) {
            var context = wx.createCanvasContext(canvasId, this)
            // // 外层圆环
            // context.beginPath()
            // context.arc(width / 2, 40, width / 2 - 70, 1 * Math.PI, 2 * Math.PI,true)
            // context.setLineWidth(12)
            // context.setLineCap('round')
            // context.setStrokeStyle('#ebeeeb')
            // context.textAlign = 'center' //文字居中
            // context.font = '14px Arial'
            // context.fillStyle = '#7D7D7D' //字体颜色
            // context.fillText('今日步数',width / 2,25)
            // context.stroke()

            let stepData = 0;
            let angle = Math.ceil(stepNum / 100);
            console.log("angleangle",angle)
            timer = setInterval(() => {
                if(stepData === angle){
                    clearInterval(timer);
                }else{
                    stepData += 1 ;
                    //外层进度圆环
                    context.beginPath()
                    context.arc(width / 2, 40, width / 2 - 70, 1 * Math.PI, (1- stepData / 100) * Math.PI,true)
                    context.setLineWidth(12)
                    context.setLineCap('round')
                    context.setStrokeStyle('#00a865')
                    context.textAlign = 'center' //文字居中
                    context.font = '40px Arial'
                    context.fillStyle = '#333333' //字体颜色
                    console.log('stepNum===',stepNum)
                    context.fillText( stepNum+'' , width / 2,72);
                    context.stroke()

                    // 指示器
                    const xAxis = Math.cos(Math.PI * 2 / 360 * (1.8 * (100 - stepData))) * (width / 2 - 70)
                    const yAxis = Math.sin(Math.PI * 2 / 360 * (1.8 * (100 - stepData))) * (width / 2 - 70)
                    context.beginPath()
                    context.arc(width / 2 + xAxis, 40 + yAxis, 12, 0, 2 * Math.PI,true)
                    context.setFillStyle('#CCFFEB')
                    context.fill()
                    context.beginPath()
                    context.arc(width / 2 + xAxis, 40 + yAxis, 6, 0, 2 * Math.PI,true)
                    context.setFillStyle('#00a865')
                    context.fill()
                    context.draw()
                }
            },16);
        },
        // anmitionRic:function(runStep){
        //     let  num = 0;
        //     timerNum = setInterval(() => {
        //         if(num  === runStep){
        //             clearInterval(timerNum);
        //         }else{
        //             num+=50;
        //         }
        //    },10);
        // },
    }
})
