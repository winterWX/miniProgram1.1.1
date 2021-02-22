const util = require('../../utils/util.js');
var timer = null;
Component({
    properties: {
        stepNum: {
            type: Number,
            value : 0,
            observer(value) {
                if(value){ 
                    this.createQueryFun(value); 
                    //this.createQueryFun();
                }
            }
        },

        modelShow:{
            type: Boolean,
            value : false,
            observer(value) {
                if(value === true){
                    this.createTopDrawRing(true);
                    this.createQueryFun();
                }
            }
        },

        flagMask:{
            type: Boolean,
            value : false,
            observer(value) {
                if(value === true){
                    this.createTopDrawRing(true);
                    //this.createQueryFun();
                }
            }
        }
    },

    data: {
       numStep :0,
       radarImg:'',
       radarImgAbfore:''
    },
    
    ready: function () {
        this.setData({
            radarImg: '',
            radarImgAbfore: ''
        })
        this.createTopDrawRing();
    },

    //移除时清空存值
    detached:function(){
        wx.clearStorage('ringTopCanves');
        wx.clearStorage('ringCanves');
    },

    methods: {
        createTopDrawRing:function(){
            const query = this.createSelectorQuery();
            query.select('#ringTop').boundingClientRect(res => {
                if(res !== null) {
                    wx.setStorage({ key: 'ringTopCanves', data: JSON.stringify(res)});
                } 
                let Re = JSON.parse(wx.getStorageSync('ringTopCanves'));  
                this.topDrawRing('ringTop', Re.width, Re.height);
            }).exec()
        },

        createQueryFun:function(value){
            clearInterval(timer);
            if(value === null){
                value = 0;
            }
            const query = this.createSelectorQuery()
            query.select('#ring').boundingClientRect(res => {
                if(res !== null) {
                    wx.setStorage({ data: JSON.stringify(res), key: 'ringCanves',});
                } 
                let rings = JSON.parse(wx.getStorageSync('ringCanves'));  
                this.drawRing('ring', rings.width, rings.height, value);
            }).exec()
        },

        topDrawRing: function(canvasId, width, height){
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
                                that.setData({
                                    radarImg: tempFilePath,
                                    show: true
                                });
                            },
                            fail: function(res) {
                                console.log(res);
                            }
                        }, that);
                    },200)
                );
        },

        drawRing: function (canvasId, width, height,stepNum) {
            if(this.data.modelShow || this.data.flagMask){
                this.imageDrawRing(canvasId, width, height,stepNum);
            }else{
                this.setData({ radarImgAbfore :''});
                clearInterval(timer);
                var context = wx.createCanvasContext(canvasId, this)
                let num = 0;
                let angle = 0;
                timer = setInterval(() => {
                    if(Math.abs(num - stepNum) < 100){    // 这里的清除订时器的条件需要改一下
                        num = stepNum;
                        clearInterval(timer);
                    }else{
                        num += 100;
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
                },200);
            }
        },

        imageDrawRing:function(canvasId, width, height,stepNum){
            if(this.data.modelShow && !this.data.flagMask) { 
                stepNum = 0;
            }
            console.log( 'this.data.modelShow', this.data.modelShow, stepNum);
            var context = wx.createCanvasContext(canvasId, this);
            let angle = 0;
            let numStep = stepNum === 0 ? 1 : stepNum;
            console.log('numStep--->',numStep);
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
                            that.setData({
                                radarImgAbfore: tempFilePath,
                                show: true
                            });
                        },
                        fail: function(res) {
                            console.log(res);
                        }
                    }, that);
                },200)
            );
        }
    }
})





