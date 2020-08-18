import { formatNumber, formatTime } from '../../utils/util';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rstProdu: 'rstProdu',
    btnHidden: 'btnHidden',
    active: 4,
    hideFlag: true,//true-隐藏  false-显示
    optionList: ['暂不选择', '男', '女', '保密'],
    gender: '暂不选择',
    animationData: {},//
    currentDate: '',
    userInfo: {
      nickName: '',
      gender: '',
      birthday: '--',
      avatarUrl: '',
      phone: '',
      email: '未绑定',
      percentage: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('back');
    console.log(formatTime(new Date()));
    const currentDate = formatTime(new Date()).split(' ')[0].split('/').join('-');
    const { nickName, gender, birthday = '', avatarUrl = '' } = app.globalData.userInfoDetail;
    const userInfo = {
      nickName,
      avatarUrl,
      gender: gender === 1 ? '男' : '女',
    }
    this.setData({
      userInfo: Object.assign(this.data.userInfo, userInfo),
      currentDate
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getMyprofileInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      active: 4
    })
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
    console.log(this.data);
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
  onShareAppMessage: function () { },
  healthPage: function () {
    if (app.globalData.loginSuccess && app.globalData.isWeRunSteps) {
      let that = this;
      wx.navigateTo({
        url: '../../pages/healthPage/index?id=' + that.data.rstProdu
      })
    } else {
      this.getWeRunStepsData();
    }
  },
  getWeRunStepsData: function () {
    let that = this;
    wx.getWeRunData({
      success: function (res) {
        app.globalData.isWeRunSteps = true;
        wx.navigateTo({
          url: '../../pages/healthPage/index?id=' + that.data.rstProdu
        })
      },
      fail: function () {
        wx.navigateTo({
          url: '../../pages/healthPage/index?flg=' + that.data.btnHidden
        })
      }
    })
  },
  getWeRunStepsRefs: function () {
    wx.getWeRunData({
      success: function (res) {
        wx.navigateTo({
          url: '../../pages/healthPage/index',
        })
      },
      fail: function () {
        console.log('---------')
      }
    })
  },
  getMyprofileInfo: function () {
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/myprofile/homepage/search',
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 200) {
          const { nickName, gender, avatarUrl = '' } = app.globalData.userInfoDetail;
          const { data: { data: { birthday, email, mobile, percentage } } } = res;
          let userInfo = {
            nickName: nickName,
            gender: gender === 1 ? '男' : '女',
            birthday: birthday || '--',
            avatarUrl: avatarUrl,
            phone: mobile || '未绑定',
            email: email || '未绑定'
          }
          userInfo.percentage = that.getPercentage(userInfo);
          that.setData({
            userInfo: userInfo
          })
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
    // }
  },
  getPercentage: function (userInfo) {
    let keysWithValue = 0;
    delete userInfo.percentage
    let allKeys = Object.keys(userInfo).length;
    const invalidValue = ['--', '未绑定', '暂不选择', '保密'];
    for (let key in userInfo) {
      if (userInfo[key] && !invalidValue.includes(userInfo[key])) {
        keysWithValue++;
      }
    }
    console.log(keysWithValue, allKeys)
    return (keysWithValue / allKeys).toFixed(2) * 100;
  },
  /* 编辑生日 */
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let userInfo = {
      ...this.data.userInfo,
      birthday: e.detail.value
    };
    userInfo.percentage = this.getPercentage(userInfo); 
    this.setData({
      userInfo
    })
  },
  /* 编辑内容的弹框 */
  // 点击选项
  getOption: function (e) {
    this.data.userInfo.gender = e.currentTarget.dataset.value;
    // 注意： 这里要先发送接口 成功后设置页面数据
    let userInfo = {
      ...this.data.userInfo,
      gender: e.currentTarget.dataset.value
    }
    userInfo.percentage = this.getPercentage(userInfo);
    this.setData({
      userInfo: userInfo,
      hideFlag: true
    })
  },
  //取消
  mCancel: function () {
    var that = this;
    that.hideModal();
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {
    var that = this;
    that.setData({
      hideFlag: false
    })
    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间
      timingFunction: 'ease',//动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn();//调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },

  // 隐藏遮罩层
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown();//调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220)//先执行下滑动画，再隐藏模块

  },
  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
})