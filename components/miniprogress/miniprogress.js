const util = require('../../utils/util.js');
const app = getApp();
var timer = null;
Component({
    properties: {
        stepNum: {
            type: Number,
            value : 1,
            observer(value) {
                if(value){
                    this.createBlueRound(value); 
                    this.setData({ readyBlueImge: ''});
                }
            }
        },

        modelShow:{
            type: Boolean,
            value : false,
            observer(value) {
                if(!value){
                   this.setData({ readyBlueImge : '',readyTopImg: '' })
                }
                this.createBlueRound( this.data.stepNum );
                this.createTopDrawRing();
            }
        },
    },

    data: {
       numStep : 0,
       readyTopImg: '',
       readyBlueImge: ''
    },
    
    ready: function () {
        this.createTopDrawRing();
        this.createBlueRound(this.data.stepNum);
    },

    methods: {
        createTopDrawRing:function(){
            const query = this.createSelectorQuery();
            query.select('#ringTop').boundingClientRect(res => {
                this.topDrawRing('ringTop', res.width, res.height);
            }).exec()
        },
        createBlueRound:function(stepNum){
            clearInterval(timer);
            const query = this.createSelectorQuery()
            query.select('#ring').boundingClientRect(res => { 
                this.drawRing('ring', res.width, res.height, stepNum);
            }).exec()
        },
        topDrawRing: function(canvasId, width, height){
            if(this.data.modelShow){
                this.topImageRing(canvasId, width, height);
            }else{
                this.setData({ readyTopImg :''});
                var context = wx.createCanvasContext(canvasId, this);
                // 外层圆环
                console.log('context',context);
                context.beginPath();
                context.arc(width / 2, 40, width / 2 - 70, 1 * Math.PI, 2 * Math.PI,true);
                context.setLineWidth(10);
                context.setLineCap('round');
                context.setStrokeStyle('#ebeeeb');
                context.stroke();
                context.draw();
            }
        },
        topImageRing:function(canvasId, width, height){
            var context = wx.createCanvasContext(canvasId, this);
            // 外层圆环
            context.beginPath();
            context.arc(width / 2, 40, width / 2 - 70, 1 * Math.PI, 2 * Math.PI,true);
            context.setLineWidth(10);
            context.setLineCap('round');
            context.setStrokeStyle('#ebeeeb');
            context.stroke();
            let that = this;
                context.draw(
                    true, setTimeout(()=>{
                        wx.canvasToTempFilePath({
                            canvasId: canvasId,
                            success: function(res) {
                                let tempFilePath = res.tempFilePath;
                                that.setData({ readyTopImg: tempFilePath });
                                that.successImage();
                            },
                            fail: function(res) {
                                console.log(res);
                            }
                        }, that);
                    },20)
            );
        },
        drawRing: function (canvasId, width, height,stepNum) {
            clearInterval(timer);
            if(this.data.modelShow){
                this.imageDrawRing(canvasId, width, height,stepNum);
            }else{
                this.setData({ readyBlueImge :''});
                var context = wx.createCanvasContext(canvasId, this)
                let num = 0;
                let angle = 0;
                timer = setInterval(() => {
                    if(Math.abs(num - stepNum) <= 210){    
                        num = stepNum;
                        clearInterval(timer);
                    }else{
                        num += 210;
                        //外层进度圆环
                        if(num >= 10000){
                            angle = 100;
                        }else{
                            angle = Math.ceil(num / 100);
                        }
                    }
                    angle = angle === 0 ? 1 : angle;
                    context.beginPath()
                    context.arc(width / 2, 40, width / 2 - 70, 1 * Math.PI, (1- angle / 100) * Math.PI,true)
                    context.setLineWidth(10)
                    context.setLineCap('round')
                    context.setStrokeStyle('#00a865')
                    this.setData({ numStep: util.escapeThousands( num ) });
                    context.stroke();
                    // 指示器
                    const xAxis = Math.cos(Math.PI * 2 / 360 * (1.8 * (100 - angle))) * (width / 2 - 70)
                    const yAxis = Math.sin(Math.PI * 2 / 360 * (1.8 * (100 - angle))) * (width / 2 - 70)
                    context.beginPath()
                    context.arc(width / 2 + xAxis, 40 + yAxis, 10, 0, 2 * Math.PI,true)
                    context.setFillStyle('#CCFFEB')
                    context.fill()
                    context.beginPath()
                    context.arc(width / 2 + xAxis, 40 + yAxis, 4, 0, 2 * Math.PI,true)
                    context.setFillStyle('#00a865')
                    context.fill();
                    context.draw();
                },30);
            }
        },
        imageDrawRing:function(canvasId, width, height,stepNum){
            var context = wx.createCanvasContext(canvasId, this);
            let angle = 0;
            let numStep = stepNum === 0 ? 1 : (stepNum >= 10000 ? 10000 : stepNum );

            angle = Math.ceil(numStep / 100);
            context.beginPath();
            context.arc(width / 2, 40, width / 2 - 70, 1 * Math.PI, (1- angle / 100) * Math.PI,true)
            context.setLineWidth(10)
            context.setLineCap('round');
            context.setStrokeStyle('#00a865');
            this.setData({ numStep : util.escapeThousands( stepNum )});
            context.stroke();
            // 指示器
            const xAxis = Math.cos(Math.PI * 2 / 360 * (1.8 * (100 - angle))) * (width / 2 - 70)
            const yAxis = Math.sin(Math.PI * 2 / 360 * (1.8 * (100 - angle))) * (width / 2 - 70)
            context.beginPath();
            context.arc(width / 2 + xAxis, 40 + yAxis, 10, 0, 2 * Math.PI,true)
            context.setFillStyle('#CCFFEB');
            context.fill();
            context.beginPath();
            context.arc(width / 2 + xAxis, 40 + yAxis, 4, 0, 2 * Math.PI,true)
            context.setFillStyle('#00a865');
            context.fill();
            let that = this;
            context.draw(
                true, setTimeout(()=>{
                    wx.canvasToTempFilePath({
                        canvasId: canvasId,
                        success: function(res) {
                            let tempFilePath = res.tempFilePath;
                            that.setData({ readyBlueImge: tempFilePath });
                            that.successImage();
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    }, that);
                },50)
            );
        },
        successImage:function(){
            let that = this;
            if(that.data.readyBlueImge !== '' && that.data.readyTopImg !== ''){
                that.triggerEvent('imageFlg',{
                    imageFlg: true
                },{})
            }
        }
    }
})





