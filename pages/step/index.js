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
    currentTabId: 'day',
    tabs: [
      {
        name: '日',
        id: 'day'
      }, {
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
  },
  toHistoryStep: function () {
    wx.navigateTo({
      url: '../historyStep/index',
    })
  },
  changTab: function(e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      currentTabId: e.currentTarget.dataset.props
    })
  },
  getStepInfo: function() {
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
  }
})
