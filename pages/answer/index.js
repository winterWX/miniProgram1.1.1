// pages/answer/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions: [
      {
        "question": "喝醋可以软化血管吗?001",
        "options": [
          {
            "optionId": 12,
            "isCorrect": 2,
            "option": "是"
          },
          {
            "optionId": 23,
            "isCorrect": 1,
            "option": "否"
          }
        ],
        "id": 14
      },
      {
        "question": "冰淇淋没有热量?002",
        "options": [
          {
            "optionId": 15,
            "isCorrect": 2,
            "option": "正确"
          },
          {
            "optionId": 16,
            "isCorrect": 1,
            "option": "错误"
          }
        ],
        "id": 15
      },
      {
        "question": "喝醋可以软化血管吗?003",
        "options": [
          {
            "optionId": 12,
            "isCorrect": 2,
            "option": "是"
          },
          {
            "optionId": 23,
            "isCorrect": 1,
            "option": "否"
          }
        ],
        "id": 16
      },
      {
        "question": "冰淇淋没有热量?004",
        "options": [
          {
            "optionId": 15,
            "isCorrect": 2,
            "option": "正确"
          },
          {
            "optionId": 16,
            "isCorrect": 1,
            "option": "错误"
          }
        ],
        "id": 17
      },
      {
        "question": "喝醋可以软化血管吗?005",
        "options": [
          {
            "optionId": 12,
            "isCorrect": 2,
            "option": "是"
          },
          {
            "optionId": 23,
            "isCorrect": 1,
            "option": "否"
          }
        ],
        "id": 18
      }
    ],
    questionAnalysis: [
      {
        "answer": "否",
        "question": "喝醋可以软化血管吗",
        "analysis": "喝醋不能软化血管",
        "correctAnswer": "否",
        "isCorrect": 1
      },
      {
        "answer": "错误",
        "question": "冰淇淋没有热量",
        "analysis": "冰淇淋温度低，但是也有热量",
        "correctAnswer": "错误",
        "isCorrect": 1
      },
      {
        "answer": "否",
        "question": "喝醋可以软化血管吗",
        "analysis": "喝醋不能软化血管",
        "correctAnswer": "否",
        "isCorrect": 1
      },
      {
        "answer": "错误",
        "question": "冰淇淋没有热量",
        "analysis": "冰淇淋温度低，但是也有热量",
        "correctAnswer": "错误",
        "isCorrect": 1
      },
      {
        "answer": "否",
        "question": "喝醋可以软化血管吗",
        "analysis": "喝醋不能软化血管",
        "correctAnswer": "否",
        "isCorrect": 1
      }
    ],
    quesIndex: 0,
    currentQ: {},
    selected: null,
    isConfirm: false,
    correctItem: null,
    confirm: null,
    submitResult: [],
    isOk: false,
    complete: false
  },
  selectOption: function(e) {
    this.setData({selected: e.currentTarget.dataset.answer});
  },
  confirm: function() {
    let { selected, correctItem, quesIndex, questions } = this.data;
    let complete = quesIndex === questions.length - 1;
    let confirm = selected;
    let isOk = selected.isCorrect === correctItem.isCorrect;
    this.setData({confirm , isConfirm: true, isOk, complete});
    
  },
  next: function() {
    let { questions, questionAnalysis, quesIndex} = this.data;
    let index = quesIndex + 1;
    let currentQ = questions[index];
    let correctItem = questionAnalysis[index];
    this.setData({
      quesIndex: index,
      currentQ,
      correctItem,
      isConfirm: false,
      confirm: null,
      selected: null
    });
  },
  submit: function() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { quesIndex, questions, questionAnalysis } = this.data;
    let currentQ = questions[quesIndex];
    let correctItem = questionAnalysis[quesIndex];
    this.setData({currentQ, correctItem});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})