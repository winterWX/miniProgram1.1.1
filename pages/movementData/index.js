import * as echarts from '../../components/ec-canvas/echarts';
import { formatTime } from '../../utils/util';
const app = getApp();
let tabsWithDay = [
  { name: '日', id: 'day' }, { name: '周', id: 'week' }, { name: '月', id: 'month' }
];
let tabs = [
  { name: '周', id: 'week' }, { name: '月', id: 'month' }
];
var textStyle = {
  color: '#929292',
  fontSize: 12
};
var lineStyle = {
  color: '#EDEDED',
  width: '1'
}
let checkName = '';
let currentTab = '';
var option = {
  color: ['#00A865'],
  grid: {
    left: '8',
    right: '50',
    bottom: '30',
    top: '8'
  },
  xAxis: {
    type: 'category',
    triggerEvent: true,
    interval: 24*60*60*1000*6,
    axisLabel: {
      interval: 6
    },
    axisTick: {       //y轴刻度线
      "show": false
    },
    axisLine: {       //y轴
      lineStyle: lineStyle
    },
    axisLabel: {
      textStyle: textStyle
    },
    data: []
  },
  yAxis: {
    position: 'right',
    type: 'value',
    splitNumber: 2,
    triggerEvent: true,
    splitArea: {
      show: false
    },
    splitLine: {
      lineStyle: lineStyle
    },
    axisLine: {       //y轴
      "show": false
    },
    axisTick: {       //y轴刻度线
      "show": false
    },
    axisLabel: {
      textStyle: textStyle
    },
  },
  series: [{
    data: [],
    type: 'bar',
    barWidth: 6,
    itemStyle: {
      normal: {
        barBorderRadius: [5, 5, 0, 0],
        color: function (params) {
          //判断选中的名字改变柱子的颜色样式
          if (checkName === params.name) {
            return '#00A865';
          }
        }
      }
    }
  }]
};
let chart = null;
let dateMap = {};
let weekDateMap = {};
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option);
  return chart;
}
Page({
  data: {
    currentTabId: 'week',
    preDisplayDate: '',
    timeData: 0,
    caloriesData :0,
    distanceData :0,
    noData: false,
    nextDisplayDate: '',
    selectedDate: '',
    selectedDateNum: 0,
    showSelectedDate: false,
    startTime: 0,
    endTime: '',
    echartsWeekMonth: [],
    clickNum: 0,
    initDate: '',
    currentDate: '',
    tabs: tabsWithDay,
    ec: {
      onInit: initChart
    },
    sportsData:{},
    textObject:{ 
      topTimeText:'',
      caloriesText:'',
      distanceText:''
    }
  },
  onLoad: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let endTime = parseInt(date.getTime() / 1000);
    // let initDate = `${year}年${(month < 10 ? ('0' + month) : month)}月${(day < 10 ? ('0' + day) : day)}日`;
    let initDate = `${year}年${(month < 10 ? ('0' + month) : month)}月${(day < 10 ? ('0' + day) : day)}日`;
    let currentDate = initDate;
    let nextDisplayDate = initDate;
    let timeRes = this.getWeek(initDate, 6);
    let preDisplayDate = timeRes.date;
    let startTime = timeRes.time;
    this.getStepInfo(startTime, endTime, 'week');
    this.sportsText('week');
    this.setData({
      preDisplayDate,
      nextDisplayDate,
      initDate,
      currentDate
    })
  },
  onReady: function () {
    setTimeout(() => {
      this.bindEchartsClick();
    }, 1500)
  },
  bindEchartsClick: function () {
    chart && chart.on('click', (params) => {
      option.color = ['#55D0A6'];
      checkName = params.name;
      chart.setOption(option);
      if (currentTab !== 'day') {
        this.setData({
          selectedDate: currentTab === 'month' ? dateMap[checkName.substring(0, 2)] : weekDateMap[checkName],
          selectedDateNum: params.value,
          showSelectedDate: true,
        })
      }
    })
  },
  changTab: function (e) {
    let { initDate } = this.data;
    let currentTabId = e.currentTarget.dataset.props;
    currentTab = currentTabId;
    this.data.currentTabId = currentTabId;
    let nextDisplayDate = '';
    let preDisplayDate = '';
    option.xAxis.data = [];
    option.series[0].data = [];
    if (currentTabId === 'week') {
      let nextTime = this.getWeek(initDate, 0);
      let preTime = this.getWeek(initDate, 6);
      nextDisplayDate = nextTime.date;
      preDisplayDate = preTime.date;
      this.getStepInfo(preTime.time, nextTime.time, 'week')
      this.sportsText('week');
    } else if (currentTabId === 'month') {
      let nextTime = this.getNextMonth(initDate, 0);
      let preTime = this.getPreMonth(initDate, 1);
      nextDisplayDate = nextTime.date;
      preDisplayDate = preTime.date;
      this.getStepInfo(preTime.time, nextTime.time, 'month')
      this.sportsText('month');
    } else {
      let t = new Date();
      let year = t.getFullYear();
      let month = t.getMonth() + 1;
      let date = t.getDate();
      let endTime = parseInt(t.getTime() / 1000);
      let currentDate = `${year}年${month > 10 ? month : '0' + month}月${date > 10 ? date : '0' + date}日`;
      let t1 = new Date(year, month, date);
      let startTime = t1.getTime() / 1000;
      this.setData({ currentDate })
      this.getStepInfo(startTime, endTime, 'day')
      this.sportsText('day');
    }
    this.setData({
      currentTabId,
      clickNum: 0,
      preDisplayDate,
      nextDisplayDate
    })
  },
  getStepInfo: function (startTime, endTime, demension) {
    let { currentTabId } = this.data;
    this.setData({ showSelectedDate: false });
    let that = this;
    option.color = ['#00A865'],
      wx.request({
        url: app.globalData.baseUrl + '/remote/health/data/query/histogram',
        method: "POST",
        header: {
          'Content-Type': 'application/json',
          "token": app.globalData.token,
          "native-app": "mini"
        },
        data: {
          startTime,
          endTime,
          demension,
          features: 'sports',
          type:'APP'
        },
        success: function (res) {
          if (res.data.code == 200) {
            let { dataList = [], timeData, type, caloriesData, distanceData} = res.data.data;
            if (dataList.length === 0) {
              that.setData({ timeData: 0,caloriesData :0,distanceData :0, noData: !dataList.length });
              return;
            };
            // 返回日期重新排序
            dataList.sort((a, b) => {
              return a.dataTime - b.dataTime
            });
            that.setData({
              timeData,
              caloriesData,
              distanceData, 
              tabs: type === 'MINIP' ? tabs : tabsWithDay,
              noData: !dataList.length
            });
            let xData = [];
            let yData = [];
            dateMap = {};
            weekDateMap = {};
            dataList.forEach(item => {
              let t = formatTime(new Date(item.dataTime * 1000));
              let dateArr = that.foramteDate(t);
              let [year, month, day] = dateArr;
              dateMap[day] = `${month}月${day}日`;
              if (currentTabId !== 'week') {
                currentTabId === 'day' ? xData.push(`${t.split(" ")[1].split(':')[0]}时`) : xData.push(`${t.split(" ")[0].split('/')[2]}日`);
              } else {
                let week = that.getDisplayWeek(new Date(item.dataTime * 1000));
                xData.push(week);
                weekDateMap[week] =  `${month}月${day}日`;
              }
              
              option.series[0].barWidth = currentTabId !== 'month' ? 10 : 6;
              yData.push(item.consumTime);
            });
            option.xAxis.data = xData;
            option.series[0].data = yData;
            chart && chart.setOption(option);
          }
        },
        fail: function (res) {
          console.log('.........fail..........');
        }
      })
  },
  getDisplayWeek: function(date) {
    let weekMap = {
      0: '周日',
      1: '周一',
      2: '周二',
      3: '周三',
      4: '周四',
      5: '周五',
      6: '周六'
    };
    let day = date.getDay();
    return weekMap[day];
  },
  foramteDate: function (time) {
    let timeArr = time.split(' ')[0].split('/');
    return timeArr;
  },
  preClick: function () {
    let { currentTabId, currentDate } = this.data;
    let clickNum = this.data.clickNum + 1;
    let nextDisplayDate = '';
    let preDisplayDate = '';
    let nextTime = null;
    let preTime = null;
    if (currentTabId !== 'day') {
      if (currentTabId === 'week') {
        nextTime = this.getWeek(this.data.preDisplayDate, 1);
        preTime = this.getWeek(this.data.preDisplayDate, 7);

      } else if (currentTabId === 'month') {
        nextTime = this.getPreMonth(this.data.nextDisplayDate);
        preTime = this.getPreMonth(this.data.preDisplayDate);
      }
      nextDisplayDate = nextTime.date;
      preDisplayDate = preTime.date;
      this.getStepInfo(preTime.time, nextTime.time, currentTabId)
      this.setData({
        clickNum,
        preDisplayDate,
        nextDisplayDate
      })
    } else {
      let time = this.getPreDay(currentDate);
      let { startTime, endTime, date } = time;
      this.getStepInfo(startTime, endTime, currentTabId)
      this.setData({ currentDate: date, clickNum });
    }

  },
  nextClick: function () {
    let clickNum = this.data.clickNum - 1;
    let { currentTabId, currentDate } = this.data;
    let nextDisplayDate = '';
    let preDisplayDate = '';
    let preTime = null;
    let nextTime = null;
    if (currentTabId !== 'day') {
      if (currentTabId === 'week') {
        preTime = this.getWeek(this.data.nextDisplayDate, 1, 'next');
        nextTime = this.getWeek(this.data.nextDisplayDate, 7, 'next');
      } else if (currentTabId === 'month') {
        if (clickNum === 0) {
          preTime = this.getPreMonth(this.data.initDate, 1);
          nextTime = this.getNextMonth(this.data.initDate, 0);
        } else {
          preTime = this.getNextMonth(this.data.nextDisplayDate, 0);
          nextTime = this.getNextMonth(this.data.nextDisplayDate, 1);
        }
      }
      preDisplayDate = preTime.date;
      nextDisplayDate = nextTime.date;
      this.getStepInfo(preTime.time, nextTime.time, currentTabId)
      this.setData({
        clickNum,
        preDisplayDate,
        nextDisplayDate
      })
    } else {
      let time = this.getNextDay(currentDate);
      let { startTime, endTime, date } = time;
      this.getStepInfo(startTime, endTime, currentTabId)
      this.setData({ currentDate: date, clickNum });
    }

  },
  // 获取前一个月日期
  getPreMonth: function (formateTime) {
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, day] = tmp;
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
      year2 = parseInt(year2) - 1;
      month2 = 12;
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);
    let t = new Date(year2, month2 - 1, day);;
    let time = parseInt(t.getTime() / 1000);
    let daysInMonth = days2.getDate();
    if (day2 > daysInMonth) {
      day2 = daysInMonth;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    return {
      date: `${year2}年${month2}月${day2}日`,
      time
    };
  },
  // 获取后一个月日期
  getNextMonth: function (formateTime, n) {
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, day] = tmp;
    var year2 = year;
    var month2 = parseInt(month) + n;
    if (month2 == 13) {
      year2 = parseInt(year2) + 1;
      month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    var t = new Date(year2, month2 - 1, day);
    let time = parseInt(t.getTime() / 1000);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    return {
      date: `${year2}年${month2}月${day2}日`,
      time
    }
  },
  getWeek: function (formateTime, n, direction = 'pre') {
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, date] = tmp;
    let d = new Date(year, month - 1, date);
    direction === 'pre' ? d.setDate(d.getDate() - n) : d.setDate(d.getDate() + n);
    let time = parseInt(d.getTime() / 1000);
    let year2 = d.getFullYear();
    let mon2 = d.getMonth() + 1;
    let day2 = d.getDate();
    let s = year2 + "年" + (mon2 < 10 ? ('0' + mon2) : mon2) + "月" + (day2 < 10 ? ('0' + day2) : day2) + '日';
    return {
      date: s,
      time: time
    }
  },
  getPreDay: function (formateTime) {
    let startTime = 0;
    let endTime = 0;
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, date] = tmp;
    let d = new Date(year, month - 1, date);
    let time = d.getTime();
    endTime = parseInt((time - 60 * 1000) / 1000);
    startTime = (time - 24 * 60 * 60 * 1000) / 1000;
    let d2 = new Date(startTime * 1000);
    let year2 = d2.getFullYear();
    let month2 = d2.getMonth() + 1;
    let date2 = d2.getDate();
    return {
      startTime,
      endTime,
      date: `${year2}年${month2 > 10 ? month2 : '0' + month2}月${date2 > 10 ? date2 : '0' + date2}日`
    }
  },
  getNextDay: function (formateTime) {
    let startTime = 0;
    let endTime = 0;
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, date] = tmp;
    let d = new Date(year, month - 1, date);
    let d2 = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    let year2 = d2.getFullYear();
    let month2 = d2.getMonth() + 1;
    let date2 = d2.getDate();
    startTime = parseInt(d2.getTime() / 1000);
    endTime = parseInt((startTime * 1000 + 24 * 60 * 59 * 1000) / 1000);
    return {
      startTime,
      endTime,
      date: `${year2}年${month2 > 10 ? month2 : '0' + month2}月${date2 > 10 ? date2 : '0' + date2}日`
    }
  },
  sportsText:function(tipChange){
    let that = this;
    let dayObject = {
      topTimeText:'今日运动时间',
      caloriesText:'今日消耗/卡路里',
      distanceText:'今日距离/公里'
    };
    let weekObject = {
      topTimeText:'平均运动时间',
      caloriesText:'平均消耗/卡路里',
      distanceText:'平均距离/公里'
    };
    let monthObject = {
      topTimeText:'总运动时间',
      caloriesText:'日距离/公里',
      distanceText:'日距离/公里'
    };
    if(tipChange === 'day'){
       that.setData({
         textObject : dayObject
       })
    }else if(tipChange === 'week'){
      that.setData({
        textObject : weekObject
      })
    }else if(tipChange === 'month'){
      that.setData({
        textObject : monthObject
      })
    }
  }
})
