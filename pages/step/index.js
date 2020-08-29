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
    initYearSetting: null,
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
      initDate: nextDisplayDate,
      initYearSetting: JSON.parse(JSON.stringify(this.data.currentCalcedDate))
    }, () => {
      console.log(this.data.currentCalcedDate)
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
    let nextDisplayDate = initDate;
    let preDisplayDate = '';
    if (currentTabId === 'week') {
      preDisplayDate = this.getPreOrNextDate(7);
    } else if (currentTabId === 'month') {
      preDisplayDate = this.getPreMonth(initDate);
    }
    this.setData({
      currentTabId,
      clickNum: 1,
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
      this.setData({ currentCalcedDate: newDate });
    } else if (currentTabId === 'month') {
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
    let tmp = preDisplayDate.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let newDate = new Date(Number(tmp[0]), Number(tmp[1]) - 1, Number(tmp[2]));
    this.setData({
      currentCalcedDate: newDate
    })
    if (currentTabId === 'week') {
      nextDisplayDate = this.getPreOrNextDate(7, true);
    } else if (currentTabId === 'month') {
      if (clickNum === 1) {
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
    }, () => {
      if (this.data.clickNum === 1) {
        let preDisplayDate = this.data.preDisplayDate;
        let tmp = preDisplayDate.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
        let newDate = new Date(Number(tmp[0]), Number(tmp[1]) - 1, Number(tmp[2]));
        this.setData({currentCalcedDate: newDate});
      }
    })
  },
    // 获取前一个月日期
    getPreMonth: function (formateTime) {
      let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
      let [year, month, day] = tmp;
      let date = new Date(year, month, 0);
      let days = date.getDate();
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
        month2 =  '0' + month2;
      }
      return `${year2}年${month2}月${day2}日`;;
    },
    // 获取后一个月日期
    getNextMonth: function (formateTime) {
      let tmp = formateTime.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
      let [year, month, day] = tmp;
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
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
