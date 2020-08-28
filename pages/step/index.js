import * as echarts from '../../components/ec-canvas/echarts';
const app = getApp();
function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
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
      data: ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日', '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日']
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
      data: [12003, 20008, 15020, 8000, 20005, 11010, 13020, 12000, 13000, 15420, 16820, 12003, 20008, 15020, 8000, 7005, 11010, 13020, 12000, 13000, 15420, 16820, 12003, 20008, 15020, 8000, 20005, 11010, 13020, 12000],
      type: 'bar',
      barWidth: 6,
      itemStyle: {
        normal: {
          barBorderRadius: [5, 5, 0, 0]
        }
      }
    }]
  };
  chart.setOption(option);
  return chart;
}
Page({
  data: {
    currentTabId: 'week',
    preDisplayDate: '',
    nextDisplayDate: '',
    currentCalcedDate: '',
    currentYear: 0,
    currentMonth: 0,
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
    this.getStepInfo();
    let currentMonth = new Date().getMonth() + 1;
    let nextDisplayDate = this.getPreOrNextDate(0);
    let preDisplayDate = this.getPreOrNextDate(7);
    let clickNum = this.data.clickNum + 1;
    this.setData({
      clickNum,
      preDisplayDate,
      nextDisplayDate,
      currentMonth,
      initDate: nextDisplayDate
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
    this.setData({ currentCalcedDate: null })
    let interval = this.calcMonthInterval();
    let nextDisplayDate = initDate;
    let preDisplayDate = '';
    if (currentTabId === 'week') {
      preDisplayDate = this.getPreOrNextDate(7);
    } else if (currentTabId === 'month') {
      preDisplayDate = this.getPreOrNextDate(interval);
    }
    this.setData({
      currentTabId,
      clickNum: 1,
      preDisplayDate,
      nextDisplayDate
    })
  },
  getStepInfo: function () {
    wx.request({// /remote/oauth/mini/getEncryptedData
      url: app.globalData.baseUrl + '/remote/oauth/mini/getEncryptedData',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {

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
    let newDate = ''
    let nextDisplayDate = '';
    let preDisplayDate = '';
    nextDisplayDate = this.data.preDisplayDate;
    if (currentTabId === 'week') {
      preDisplayDate = this.getPreOrNextDate(7);
      let tmp = preDisplayDate.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
      newDate = new Date(Number(tmp[0]), Number(tmp[1]) - 1, Number(tmp[2]));
      this.setData({ currentCalcedDate: newDate })
    } else if (currentTabId === 'month') {
      let interval = this.calcMonthInterval();
      preDisplayDate = this.getPreOrNextDate(interval);
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
    let tmp = preDisplayDate.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let newDate = new Date(Number(tmp[0]), Number(tmp[1]) - 1, Number(tmp[2]));
    this.setData({
      currentCalcedDate: newDate
    })
    if (currentTabId === 'week') {
      nextDisplayDate = this.getPreOrNextDate(7, true);
    } else if (currentTabId === 'month') {
      this.setData({
        currentMonth: Number(tmp[1])
      })
      let interval = this.calcMonthInterval(true);
      nextDisplayDate = this.getPreOrNextDate(interval, true);
    }
    this.setData({
      clickNum,
      preDisplayDate,
      nextDisplayDate
    })
  },
  calcMonthInterval: function (flag = false) {
    let thirtyOneDayMonth = [1, 3, 5, 7, 8, 10, 12];
    let interval = 30;
    let { currentYear, currentMonth } = this.data;
    let targetMonth = 0;
    if (!flag) {
      targetMonth = currentMonth - 1 > 0 ? currentMonth - 1 : 12;
    } else {
      targetMonth = currentMonth;
    }
    if (thirtyOneDayMonth.includes(targetMonth)) {
      interval = 31;
    } else if (targetMonth === 2) {
      interval = currentYear % 4 === 0 ? 29 : 28;
    }
    return interval;
  },
  getPreOrNextDate: function (n, flag = false) {
    var n = n;
    var d = this.data.currentCalcedDate || new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    flag ? d.setDate(d.getDate() + n) : d.setDate(d.getDate() - n);
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    this.setData({
      currentCalcedDate: d,
      currentMonth: mon,
      currentYear: year
    })
    let s = year + "年" + (mon < 10 ? ('0' + mon) : mon) + "月" + (day < 10 ? ('0' + day) : day) + '日';
    return s;
  }
})
