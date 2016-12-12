//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    orderList: []
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad (option) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/orderlist/',
      userInfo = {}

    app.infoReady(() => {
      app.getData(url, {}, data => {
        self.setData({
          orderList: data
        })
      })
    })
  }
})
