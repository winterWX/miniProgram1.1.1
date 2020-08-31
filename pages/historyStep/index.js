//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    currentMonth: 8,
    steps: [
      {
        month: 8,
        steps: [
          {
            date: '2020年8月6日',
            number: 10000
          }, {
            date: '2020年8月5日',
            number: 10000
          }, {
            date: '2020年8月4日',
            number: 10000
          }
        ]
      }, {
        month: 7,
        steps: [
          {
            date: '2020年7月6日',
            number: 10000
          }, {
            date: '2020年7月5日',
            number: 10000
          }, {
            date: '2020年7月4日',
            number: 10000
          }]
      }
    ]
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
