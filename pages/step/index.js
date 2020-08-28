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
    clickNum: 0,
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
    let nextDisplayDate = this.getPreOrNextDate(0);
    let preDisplayDate = this.getPreOrNextDate(7);
    let clickNum = this.data.clickNum + 1;
    console.log(clickNum)
    this.setData({
      clickNum,
      preDisplayDate,
      nextDisplayDate
    })
  },
  toHistoryStep: function () {
    wx.navigateTo({
      url: '../historyStep/index',
    })
  },
  changTab: function (e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      currentTabId: e.currentTarget.dataset.props
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
    let clickNum = this.data.clickNum + 1;
    let nextDisplayDate = this.data.preDisplayDate;
    let preDisplayDate = this.getPreOrNextDate(7);
    let tmp = preDisplayDate.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let newDate = new Date(Number(tmp[0]), Number(tmp[1])-1, Number(tmp[2]));
    this.setData({
      currentCalcedDate: newDate
    })
    this.setData({
      clickNum,
      preDisplayDate,
      nextDisplayDate
    }, () => {
      console.log(this.data.clickNum)
    })
  },
  nextClick: function () {
    let clickNum = this.data.clickNum - 1;
    let preDisplayDate = this.data.nextDisplayDate;
    let tmp = preDisplayDate.replace(/[\u4e00-\u9fa5]/g, '-').split('-');
    let newDate = new Date(Number(tmp[0]), Number(tmp[1])-1, Number(tmp[2]));
    this.setData({
      currentCalcedDate: newDate
    })
    let nextDisplayDate = this.getPreOrNextDate(7, true);
    console.log(clickNum)
    this.setData({
      clickNum,
      preDisplayDate,
      nextDisplayDate
    }, () =>{
      console.log(this.data.clickNum)
    })
  },
  clacMonthInterval: function (month) {
    let thirtyOneDayMonth = [1, 3, 5, 7, 8, 10, 12];
  },
  getPreOrNextDate: function (n, flag = false) {
    var n = n;
    var d = this.data.currentCalcedDate || new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var day = d.getDate();
    /* if (day <= n) {
      if (mon > 1) {
        mon = mon - 1;
      } else {
        year = year - 1;
        mon = 12;
      }
    } */
    flag ? d.setDate(d.getDate() + n) : d.setDate(d.getDate() - n);
    if (!flag) {
      this.setData({
        currentCalcedDate: d
      })
    }
    year = d.getFullYear();
    mon = d.getMonth() + 1;
    day = d.getDate();
    let s = year + "年" + (mon < 10 ? ('0' + mon) : mon) + "月" + (day < 10 ? ('0' + day) : day) + '日';
    return s;
  }
})
