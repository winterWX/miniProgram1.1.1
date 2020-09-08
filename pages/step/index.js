import * as echarts from '../../components/ec-canvas/echarts';
import { formatTime } from '../../utils/util';
const app = getApp();
let tabsWithDay = [
  //{ name: '日', id: 'day' }, { name: '周', id: 'week' }, { name: '月', id: 'month' }
    { name: '周', id: 'week' }, { name: '月', id: 'month' }
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
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#00A865'
      }
    }
  },
  grid: {
    left: '8',
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
        barBorderRadius: [3, 3, 0, 0],
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
    stepData: 0,
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
    }
  },
  onLoad: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let endTime = parseInt(date.getTime() / 1000);
    let initDate = `${year}年${(month < 10 ? ('0' + month) : month)}月${(day < 10 ? ('0' + day) : day)}日`;
    let currentDate = initDate;
    let nextDisplayDate = initDate;
    let timeRes = this.getWeek(initDate, 6);
    let preDisplayDate = timeRes.date;
    let startTime = timeRes.time;
    this.getStepInfo(startTime, endTime, 'week')
    this.setData({
      preDisplayDate,
      nextDisplayDate,
      initDate,
      currentDate
    })
  },
  onReady: function () {
    let isBindEvent = false;
    let timer = null;
    timer = setInterval(() => {
      if (isBindEvent) {
        clearInterval(timer);
        return;
      }
      if (chart) {
        isBindEvent = true;
        chart.on('click', (params) => {
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
      }
    }, 100)
  },
  onUnload: function(){
    chart = null;
  },
  toHistoryStep: function () {
    wx.navigateTo({
      url: '../historyStep/index',
    })
  },
  changTab: function (e) {
    let { initDate } = this.data;
    let currentTabId = e.currentTarget.dataset.props;
    currentTab = currentTabId;
    this.data.currentTabId = currentTabId;
    var nextDisplayDate = '';
    var preDisplayDate = '';
    option.xAxis.data = [];
    option.series[0].data = [];
    if (currentTabId === 'week') {
      let nextTime = this.getWeek(initDate, 0);
      let preTime = this.getWeek(initDate, 6);
      nextDisplayDate = nextTime.date;
      preDisplayDate = preTime.date;
      this.getStepInfo(preTime.time, nextTime.time, 'week')
    } else if (currentTabId === 'month') {
      let tResult = this.initMonthDate(initDate);
      nextDisplayDate = tResult.nextDisplayDate;
      preDisplayDate = tResult.preDisplayDate;
      this.getStepInfo(tResult.startTime, tResult.endTime, 'month');
    } else {
      let t = new Date();
      let year = t.getFullYear();
      let month = t.getMonth() + 1;
      let date = t.getDate();
      let endTime = parseInt(t.getTime() / 1000);
      let currentDate = `${year}年${month > 10 ? month : '0' + month}月${date < 10 ? '0' + date : date}日`
      let t1 = new Date(year, month, date);
      let startTime = t1.getTime() / 1000;
      this.setData({ currentDate })
      this.getStepInfo(startTime, endTime, 'day')
    }
    this.setData({
      currentTabId,
      clickNum: 0,
      preDisplayDate,
      nextDisplayDate,
      selectedDate: ''
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
          "token": app.globalData.token
        },
        data: {
          startTime,
          endTime,
          demension,
          features: 'steps'
        },
        success: function (res) {
          if (res.data.code == 200) {
            let { dataList = [], stepData, type } = res.data.data;
            if (dataList.length === 0) {
              that.setData({ stepData: 0, noData: !dataList.length });
              return;
            };
            // 返回日期重新排序
            dataList.sort((a, b) => {
              return a.dataTime - b.dataTime
            });
            that.setData({
              stepData,
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
                weekDateMap[week] = `${month}月${day}日`;
              }
              option.series[0].barWidth = currentTabId !== 'month' ? 14 : 6;
              if (currentTabId === 'week') {
                option.series[0].itemStyle.normal.barBorderRadius = [10,10,0,0];
              };
              yData.push(item.steps);
            });
            option.xAxis.data = xData;
            option.series[0].data = yData;
            chart && chart.setOption(option);
          }
        },
        fail: function (res) {
          option.xAxis.data = [];
          option.series[0].data = [];
          chart && chart.setOption(option);
          that.setData({ stepData: 0, noData: true });
        }
      })
  },
  getDisplayWeek: function (date) {
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
    let monthResult = null;
    if (currentTabId !== 'day') {
      if (currentTabId === 'week') {
        nextTime = this.getWeek(this.data.preDisplayDate, 1);
        preTime = this.getWeek(this.data.preDisplayDate, 7);
      } else if (currentTabId === 'month') {
        monthResult = this.getMonth(this.data.nextDisplayDate);
      }
      nextDisplayDate = currentTabId === 'week' ? nextTime.date : monthResult.nextDisplayDate;
      preDisplayDate = currentTabId === 'week' ? preTime.date : monthResult.preDisplayDate;
      let startTime = currentTabId === 'week' ? preTime.time : monthResult.startTime;
      let endTime = currentTabId === 'week' ? nextTime.time : monthResult.endTime;
      this.getStepInfo(startTime, endTime, currentTabId)
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
    let { currentTabId, currentDate, initDate } = this.data;
    let nextDisplayDate = '';
    let preDisplayDate = '';
    let preTime = null;
    let nextTime = null;
    let monthResult = null;
    if (currentTabId !== 'day') {
      if (currentTabId === 'week') {
        preTime = this.getWeek(this.data.nextDisplayDate, 1, 'next');
        nextTime = this.getWeek(this.data.nextDisplayDate, 7, 'next');
      } else if (currentTabId === 'month') {
        if (clickNum === 0) {
          monthResult = this.initMonthDate(initDate);
        } else {
          monthResult = this.getMonth(this.data.nextDisplayDate, true);
        }
      }
      nextDisplayDate = currentTabId === 'week' ? nextTime.date : monthResult.nextDisplayDate;
      preDisplayDate = currentTabId === 'week' ? preTime.date : monthResult.preDisplayDate;
      let startTime = currentTabId === 'week' ? preTime.time : monthResult.startTime;
      let endTime = currentTabId === 'week' ? nextTime.time : monthResult.endTime;
      this.getStepInfo(startTime, endTime, currentTabId);
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
  // 切换的tab到月的时候 初始化月份显示时间
  initMonthDate: function (formateTime) {
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, day] = tmp;
    let cTime = new Date(year, month - 1, day);
    let endTime = parseInt(cTime.getTime() / 1000);
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
    let t = new Date(year2, month2 - 1, day2);
    let startTime = parseInt(t.getTime() / 1000);
    return {
      preDisplayDate: `${year2}年${month2}月${day2}日`,
      nextDisplayDate: formateTime,
      startTime,
      endTime
    };
  },
  // 获取前一个月数据
  getMonth: function (formateTime, flag = false) {
    let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let [year, month, day] = tmp;
    let year2 = year;
    let month2 = !flag ? parseInt(month) - 1 : parseInt(month) + 1;
    if (!flag && month2 === 0) {
      month2 = 12;
      year2 = parseInt(year) - 1;
    } else if (flag && month2 === 13) {
      year2 = parseInt(year) + 1;
      month2 = 1;
    };
    let t = new Date(year2, month2 - 1, 1);
    let startTime = parseInt(t.getTime() / 1000);
    let t2 = new Date(year2, month2, 0);
    let days = t2.getDate();
    let t3 = new Date(year2, month2 - 1, days);
    let endTime = parseInt(t3.getTime() / 1000);
    return {
      startTime,
      endTime,
      preDisplayDate: `${year2}年${month2 < 10 ? '0' + month2 : month2}月01日`,
      nextDisplayDate: `${year2}年${month2 < 10 ? '0' + month2 : month2}月${days}日`
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
      date: `${year2}年${month2 < 10 ? '0' + month2 : month2}月${date2 < 10 ? '0' + date2 : date2}日`
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
      date: `${year2}年${month2 < 10 ? '0' + month2 : month2}月${date2 < 10 ? '0' + date2 : date2}日`
    }
  }
})
