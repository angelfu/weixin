//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    godDetail: {},
    commentList: {}
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad (option) {
    console.log(option)
    console.log('onLoad')
    var self = this,
      url = 'https://wxtest.yupaopao.cn/goddetail/',
      userInfo = {}

    app.infoReady(() => {
      userInfo = app.globalData.userInfo
      userInfo.code = app.globalData.code
      userInfo.latitude = app.globalData.local.latitude
      userInfo.longitude = app.globalData.local.longitude
      app.getData(url, { userInfo }, data => {
        console.log(data)
        self.setData({
          godDetail: data.god_detail,
          commentList: data.rate_list
        })
      })
    })
  }
})
