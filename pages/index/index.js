//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    godList: []
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad () {
    console.log('onLoad')
    var self = this,
      url = 'https://wxtest.yupaopao.cn/godlist/',
      userInfo = {}
    app.infoReady(() => {
      userInfo = app.globalData.userInfo
      userInfo.code = app.globalData.code
      userInfo.latitude = app.globalData.local.latitude
      userInfo.longitude = app.globalData.local.longitude
      app.getData(url, { userInfo }, data => {
        console.log(data)
        //更新数据
        self.setData({
          godList: data
        })
      })
    })
    wx.navigateTo({
      url: '../order/order'
    })
  },
  localToDetail (event) {

  }
})
