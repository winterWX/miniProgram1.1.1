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
    hideAvatarFlag: true,//true-隐藏  false-显示
    selectedAvatarId: '',
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
      percentage: 0,
      id:''
    },
    avatarObjList: [
      {
        url: '../../images/iconDefultTouxiang.png',
        id: 13
      }, {
        url:  '../../images/iconLaoshu.png',
        id: 1
      }, {
        url: '../../images/iconNiu.png',
        id: 2
      }, {
        url: '../../images/iconLaoshu.png',
        id: 3
      },{
        url: '../../images/iconTuzi.png',
        id: 4
      }, {
        url: '../../images/iconLong.png',
        id: 5
      }, {
        url: '../../images/iconLong.png',
        id: 6
      }, {
        url: '../../images/iconMa.png',
        id: 7
      }, {
        url: '../../images/iconYang.png',
        id: 8
      }, {
        url: '../../images/iconHouzi.png',
        id: 9
      }, {
        url: '../../images/iconJi.png',
        id: 10
      }, {
        url: '../../images/iconGou.png',
        id: 11
      }, {
        url: '../../images/iconZhu.png',
        id: 12
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        const { nickName, gender, avatarUrl = '', phoneNumber } = app.globalData.userInfoDetail;
        let userInfo = {};
        if (res.data.code == 200) {
          const { data: { data: { avatar, birthday, email, mobile = '', percentage, nickname, id } } } = res;
          let formateDate = formatTime(new Date(parseInt(birthday) * 1000)).split(' ')[0].split('/').join('-');
          let selectedAvatar = that.data.avatarObjList.find(item => item.id === avatar);
          userInfo = {
            nickName: nickname || nickName,
            gender: gender === 1 ? '男' : '女',
            birthday: formateDate || '--',
            avatarUrl: selectedAvatar && selectedAvatar.url || avatarUrl,
            phone: mobile || phoneNumber || '未绑定',
            email: email || '未绑定',
            id: id
          }
        } else {
          userInfo = {
            nickName: nickName,
            gender: gender === 1 ? '男' : '女',
            birthday: '--',
            avatarUrl: avatarUrl,
            phone: phoneNumber || '未绑定',
            email: '未绑定',
          }
        }
        userInfo.percentage = that.getPercentage(userInfo);
        that.setData({
          userInfo: userInfo
        })
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
    return (keysWithValue / allKeys).toFixed(2) * 100;
  },
  /* 编辑生日 */
  bindDateChange: function (e) {
    let birthday = e.detail.value.split('-').join('/') || '';
    let birthdayStr = new Date(birthday).getTime() / 1000;
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/myProfile/edit',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data:{
        "birthday": birthdayStr,
        "id": this.data.userInfo.id
      },
      success: function (res) {
        if (res.data.code == 200) {
          let userInfo = {
            ...that.data.userInfo,
            birthday: e.detail.value
          };
          userInfo.percentage = that.getPercentage(userInfo); 
          that.setData({
            userInfo
          })
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
      }
    })
  },
  /* 编辑内容的弹框 */
  // 点击选项
  getOption: function (e) {
    console.log(e.currentTarget.dataset);
    // 注意： 这里要先发送接口 成功后设置页面数据
    const {nickName, avatarUrl, birthday } = this.data.userInfo;
    let sexValue = e.currentTarget.dataset.value;
    let gender = 1;
    if (sexValue === '男' || sexValue === '女') {
      gender = sexValue === '男' ? 1 : 0;
    } else {
      gender = '';
    }
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/myProfile/edit',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data:{
        "gender": gender,
        "id": this.data.userInfo.id
      },
      success: function (res) {
        if (res.data.code == 200) {
          let userInfo = {
            ...that.data.userInfo,
            gender: e.currentTarget.dataset.value
          }
          userInfo.percentage = that.getPercentage(userInfo);
          that.setData({
            userInfo: userInfo,
            hideFlag: true
          })
        } else {
          that.setData({
            hideFlag: true
          })
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
        this.setData({
          hideFlag: true
        })
      }
    })
  },
  // 点击选项
  getAvatarOption: function (e) {
    console.log(e.currentTarget.dataset);
    // 注意： 这里要先发送接口 成功后设置页面数据
    // const {nickName, avatarUrl, birthday } = this.data.userInfo;
    let id = e.currentTarget.dataset.value;
    let avatarUrl = this.data.avatarObjList.find(item  => item.id === id);
    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/remote/myProfile/edit',
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        "token": app.globalData.token
      },
      data:{
        "avatar": id,
        "id": this.data.userInfo.id
      },
      success: function (res) {
        if (res.data.code == 200) {
          let userInfo = {
            ...that.data.userInfo,
            avatarUrl: avatarUrl.url
          }
          userInfo.percentage = that.getPercentage(userInfo);
          that.setData({
            userInfo: userInfo,
            hideAvatarFlag: true
          })
        } else {
          that.setData({
            hideAvatarFlag: true
          })
        }
      },
      fail: function (res) {
        console.log('.........fail..........');
        this.setData({
          hideAvatarFlag: true
        })
      }
    })
  },
  //取消
  mCancel: function (e) {
    var that = this;
    that.hideModal(e);
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function (e) {
    var that = this;
    if (e.target.dataset.name === 'gender') {
      that.setData({
        hideFlag: false
      })
    } else {
      that.setData({
        hideAvatarFlag: false
      })
    }
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
  hideModal: function (e) {
    console.log(e.target.dataset)
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,//动画的持续时间 默认400ms
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown();//调用动画--滑出
    var time1 = setTimeout(function () {
      if (e.target.dataset.name === 'gender') {
        that.setData({
          hideFlag: true
        })
      } else {
        that.setData({
          hideAvatarFlag: true
        })
      }
     /*  that.setData({
        hideFlag: true
      }) */
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