import * as echarts from '../../components/ec-canvas/echarts';
const app = getApp();
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
    nextDisplayDate: '',
    startTime: 0,
    endTime: '',
    echartsWeekList: [],
    echartsWeekMonth: [],
    clickNum: 0,
    initDate: '',
    tabs: [
    /*   {
        name: '日',
        id: 'day'
      }, */ {
        name: '周',
        id: 'week'
      }, {
        name: '月',
        id: 'month'
      }
    ],
    ec: {
      onInit: initChart
    }
  },
  onLoad: function () {
    let stepList = this.formateStepData(app.globalData.runData);
    let stepListWeek = this.splitRunData(stepList, 7);
    let stepListMonth = app.globalData.runData;
    // this.getStepInfo();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let endTime = date.getTime() / 1000;
    let initDate = `${year}年${(month < 10 ? ('0' + month) : month)}月${(day < 10 ? ('0' + day) : day)}日`;
    let nextDisplayDate = initDate;
    let timeRes = this.getWeek(initDate, 6);
    let preDisplayDate = timeRes.date;
    let startTime = timeRes.time / 1000;
    let option = this.displayEcharts(stepListWeek[0]);
    this.setData({
      preDisplayDate,
      nextDisplayDate,
      initDate,
      echartsWeekList: stepListWeek,
      echartsWeekMonth: stepListMonth
    })
  },
  formateStepData: function (datas) {
    let stepList = datas.map(item => {
      return {
        date: `${item.date.split('/')[2]}日`,
        step: item.step
      }
    })
    return stepList
  },
  displayEcharts: function (data) {
    let arr = data && data.reverse();
    let xData = [];
    let yData = [];
    arr.forEach(item => {
      xData.push(item.date);
      yData.push(item.step);
    })
    option.xAxis.data = xData;
    option.series[0].data = yData;
    return option;
  },
  splitRunData: function (runDataArr, size) {
    let results = [];
    for (let i = 0; i < runDataArr.length; i = i + size) {
      results.push(runDataArr.slice(i, i + size));
    }
    return results;
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
    } else if (currentTabId === 'month') {
      preDisplayDate = this.getPreMonth(initDate);
    }
    this.setData({
      currentTabId,
      clickNum: 0,
      preDisplayDate,
      nextDisplayDate
    })
  },
  getStepInfo: function () {
    wx.request({
      url: app.globalData.baseUrl + '/remote/oauth/mini/getEncryptedData',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 200) {

        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  preClick: function () {
    let { currentTabId, echartsWeekList } = this.data;
    let clickNum = this.data.clickNum + 1;
    let nextDisplayDate = '';
    let preDisplayDate = '';
    if (currentTabId === 'week') {
      let nextTime = this.getWeek(this.data.preDisplayDate, 1);
      let preTime = this.getWeek(this.data.preDisplayDate, 7);
      nextDisplayDate = nextTime.date;
      preDisplayDate = preTime.date;
      let option = this.displayEcharts(echartsWeekList[clickNum]);
      chart.setOption(option);
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
    let { currentTabId, echartsWeekList } = this.data;
    let nextDisplayDate = '';
    let preDisplayDate = this.data.nextDisplayDate;
    if (currentTabId === 'week') {
      let preTime = this.getWeek(preDisplayDate, 1, 'next');
      let nextTime = this.getWeek(preDisplayDate, 7, 'next')
      preDisplayDate = preTime.date;
      nextDisplayDate = nextTime.date;
      let option = this.displayEcharts(echartsWeekList[clickNum]);
      chart.setOption(option);
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
    let time = d.getTime();
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
