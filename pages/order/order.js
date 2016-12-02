//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    godDetail: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  getGodList (userInfo) {
    var self = this;
    userInfo.code = app.globalData.code
    userInfo.latitude = app.globalData.local.latitude
    userInfo.longitude = app.globalData.local.longitude
    wx.request({
      url: 'https://wxtest.yupaopao.cn/godlist/',
      data: {userInfo: userInfo},
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        self.setData({
          godList: res.data
        })
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var self = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      self.getGodList(userInfo)
      //更新数据
      self.setData({
        userInfo:userInfo
      })
    })

  }
})
