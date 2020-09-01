import * as echarts from '../../components/ec-canvas/echarts';
import { formatTime } from '../../utils/util';
const app = getApp();
let tabsWithDay =  [
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
var option = {
  color: ['#00A865'],
  grid: {
    left: '5',
    right: '50',
    bottom: '30',
    top: '8'
  },
  xAxis: {
    type: 'category',
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
        barBorderRadius: [5, 5, 0, 0]
      }
    }
  }]
};
let chart = null;
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
    stepData: 0,
    noData: false,
    nextDisplayDate: '',
    startTime: 0,
    endTime: '',
    echartsWeekMonth: [],
    clickNum: 0,
    initDate: '',
    tabs: tabsWithDay,
    ec: {
      onInit: initChart
    }
  },
  onLoad: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let endTime = parseInt(date.getTime() / 1000);
    let initDate = `${year}年${(month < 10 ? ('0' + month) : month)}月${(day < 10 ? ('0' + day) : day)}日`;
    let nextDisplayDate = initDate;
    let timeRes = this.getWeek(initDate, 6);
    let preDisplayDate = timeRes.date;
    let startTime = timeRes.time;
    this.getStepInfo(startTime, endTime, 'week')
    this.setData({
      preDisplayDate,
      nextDisplayDate,
      initDate
    })
  },
  toHistoryStep: function () {
    wx.navigateTo({
      url: '../historyStep/index',
    })
  },
  changTab: function (e) {
    let { initDate } = this.data;
    let currentTabId = e.currentTarget.dataset.props;
    let nextDisplayDate = initDate;
    let preDisplayDate = '';
    if (currentTabId === 'week') {
      let nextTime = this.getWeek(initDate, 0);
      let preTime = this.getWeek(initDate, 6);
      nextDisplayDate = nextTime.date;
      preDisplayDate = preTime.date;
      this.getStepInfo(preTime.time, nextTime.time, 'week')
    } else if (currentTabId === 'month') {
      preDisplayDate = this.getPreMonth(initDate);
      // this.getStepInfo(preTime.time, nextTime.time, 'month')
    }
    this.setData({
      currentTabId,
      clickNum: 0,
      preDisplayDate,
      nextDisplayDate
    })
  },
  getStepInfo: function (startTime, endTime, demension) {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/health/data/query/histogram',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data:{
        startTime,
        endTime,
        demension,
        features: 'steps'
      },
      success: function (res) {
        if (res.data.code == 200) {
          let { dataList=[], stepData, type } = res.data.data;
          if (dataList.length === 0) {
            that.setData({stepData: 0, noData: !dataList.length});
            return;
          };
          // 返回日期重新排序
          dataList.sort((a, b) => {
            return a.dataTime - b.dataTime
          });
          console.log()
          that.setData({
            stepData,
            tabs: type === 'MINIP' ? tabs : tabsWithDay,
            noData: !dataList.length
          })
          let stepList = dataList.map(item => {
            let date = formatTime(new Date(item.dataTime * 1000))
            return {
              step: item.steps,
              time: `${date.split(" ")[0].split('/')[2]}日`
            }
          })
          let xData = [];
          let yData = [];
          stepList.forEach(item => {
            xData.push(item.time);
            yData.push(item.step);
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
  preClick: function () {
    let { currentTabId } = this.data;
    let clickNum = this.data.clickNum + 1;
    let nextDisplayDate = '';
    let preDisplayDate = '';
    if (currentTabId === 'week') {
      let nextTime = this.getWeek(this.data.preDisplayDate, 1);
      let preTime = this.getWeek(this.data.preDisplayDate, 7);
      nextDisplayDate = nextTime.date;
      preDisplayDate = preTime.date;
      this.getStepInfo(preTime.time, nextTime.time, 'week')
    } else if (currentTabId === 'month') {
      nextDisplayDate = this.data.preDisplayDate;
      preDisplayDate = this.getPreMonth(this.data.preDisplayDate);
    }
    this.setData({
      clickNum,
      preDisplayDate,
      nextDisplayDate
    })
  },
  nextClick: function () {
    let clickNum = this.data.clickNum - 1;
    let { currentTabId } = this.data;
    let nextDisplayDate = '';
    let preDisplayDate = this.data.nextDisplayDate;
    if (currentTabId === 'week') {
      let preTime = this.getWeek(preDisplayDate, 1, 'next');
      let nextTime = this.getWeek(preDisplayDate, 7, 'next')
      preDisplayDate = preTime.date;
      nextDisplayDate = nextTime.date;
      this.getStepInfo(preTime.time, nextTime.time, 'week')
    } else if (currentTabId === 'month') {
      preDisplayDate = this.data.nextDisplayDate;
      if (clickNum === 0) {
        nextDisplayDate = this.data.initDate;
        preDisplayDate = this.getPreMonth(this.data.initDate);
      } else {
        nextDisplayDate = this.getNextMonth(this.data.nextDisplayDate);
      }
    }
    this.setData({
      clickNum,
      preDisplayDate,
      nextDisplayDate
    })
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
    let daysInMonth = days2.getDate();
    if (day2 > daysInMonth) {
      day2 = daysInMonth;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    return `${year2}年${month2}月${day2}日`;;
  },
  // 获取后一个月日期
  getNextMonth: function (formateTime) {
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, day] = tmp;
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
      year2 = parseInt(year2) + 1;
      month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    return `${year2}年${month2}月${day2}日`;
  },
  getWeek: function (formateTime, n, direction = 'pre') {
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, date] = tmp;
    let d = new Date(year, month - 1, date);
    direction === 'pre' ? d.setDate(d.getDate() - n) : d.setDate(d.getDate() + n);
    let time = d.getTime() / 1000;
    let year2 = d.getFullYear();
    let mon2 = d.getMonth() + 1;
    let day2 = d.getDate();
    let s = year2 + "年" + (mon2 < 10 ? ('0' + mon2) : mon2) + "月" + (day2 < 10 ? ('0' + day2) : day2) + '日';
    return {
      date: s,
      time: time
    }
  }
})
