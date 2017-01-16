//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    isLoad: false,
    orderList: []
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  delOrder (e) {
    var self = this,
      temp = self.data.orderList

    temp.forEach((item, i) => {
      if(item.id === e.target.dataset.id) {
        temp.splice(i, 1)
      }
    })
    self.setData({
      orderList: temp
    })
  },
  onLoad (option) {
    var self = this,
      url = app.globalData.baseUrl + 'orderlist/',
      userInfo = {}

    app.infoReady(() => {
      app.getData(url, {}, data => {
        self.setData({
          isLoad: true,
          orderList: data
        })
      })
    })
  }
})
