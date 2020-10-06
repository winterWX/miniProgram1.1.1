const app = getApp()
const util = require('./util.js')
function getWxRunData(result) {  //用result往出暴露结果
   //检查登楼状态是否过期
   wx.checkSession({
      success() {
         //session_key 未过期，并且在本生命周期一直有效
         let sessionkey = app.globalData.userInfo.session_key;
         getAllWeRunData(sessionkey, result);
      },
      fail() {
         //重新登录
         restLogin(result);
      }
   })
};
function restLogin(result) {
   wx.login({
      success: (res) => {
         if (res.code) {
            wx.getSetting({
               success: (setingres) => {
                  if (setingres.authSetting['scope.userInfo']) {
                     wx.getUserInfo({
                        success: (res) => {
                           miniproLogin(res.code, res.encryptedData, res.iv, result)
                        },
                        fail: () => {
                           console.log('---------------')
                        }
                     })
                  }
               }
            })
         }
      },
      fail: function (res) {
         console.log('重新登录fail');
      }
   })
};
//解密登录
function miniproLogin(code, enData, ivData, result) {
   const parms = {
      code: code,
      encrypteData: enData,
      iv: ivData
   }
   wx.request({
      method: 'POST',
      url: app.globalData.baseUrl + '/remote/oauth/minipro/login',
      header: {
         "Content-Type": "application/json;charset=UTF-8"
      },
      data: parms,
      success: (res) => {
         if (res.data.code === 200) {
            getAllWeRunData(res.data.data.session_key, result);
         }
      }
   })
};
// 存储微信授权时间
function wxAuthorizedTime() {
   return new Promise((resolve) => {
      wx.request({
         url: app.globalData.baseUrl + '/remote/health/data/query/latestime',
         method: "GET",
         header: {
            'Content-Type': 'application/json',
            "token": app.globalData.token
         },
         success: function (res) {
            resolve(res);
         },
         fail: function (res) {
            console.log('.........fail..........');
         }
      })
   })
};
// 上传初次授权时间
function postFirstAuthorizedTime() {
   let t = new Date();
   let time = t.getTime();
   let lastTime = parseInt(time / 1000);
   wx.request({
      url: app.globalData.baseUrl + '/remote/data/authorize',
      method: "post",
      header: {
         'Content-Type': 'application/json',
         "token": app.globalData.token
      },
      data: {
         lastTime,
         source: 'MINIP'
      },
      success: function (res) {
      },
      fail: function (res) {
         console.log('.........fail..........');
      }
   })
};
function getAllWeRunData(sessionkey, result) {
   // 微信授权之后看是否是第一次授权
   wxAuthorizedTime().then((data) => {
      if (data.data.code === 100711) {
         postFirstAuthorizedTime();
      }
   });
   wx.getWeRunData({
      success(resRun) {
         wx.request({
            url: app.globalData.baseUrl + '/remote/oauth/mini/getEncryptedData',
            method: 'POST',
            header: {
               'Content-Type': 'application/json',
               "token": app.globalData.token
            },
            data: {
               encryptedData: resRun.encryptedData,
               iv: resRun.iv,
               sessionkey: sessionkey
            },
            success: function (resDecrypt) {
               // 微信授权成功
               if (resDecrypt.data.data.length > 0) {
                  let runData = JSON.parse(resDecrypt.data.data);
                  if (runData.stepInfoList.length > 0) {
                     runData.stepInfoList = runData.stepInfoList.reverse()
                     for (var i in runData.stepInfoList) {
                        runData.stepInfoList[i].date = util.formatTime(new Date(runData.stepInfoList[i].timestamp * 1000)).split(' ')[0]
                     }
                  }
                  result(runData.stepInfoList)
               }
            },
            fail: function () {
               console.log('----------')
            }
         });
      },
      fail: function () {
         result([]);  //拒绝授权
      }
   })
};

module.exports = {
   getWxRunData: getWxRunData
}