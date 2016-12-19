//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    godList: []
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad () {
    var self = this,
      url = app.globalData.baseUrl + 'godlist/'

    app.getLocalReady((local) => {
      app.getData(url, local, data => {
        //更新数据
        self.setData({
          godList: data
        })
        app.infoReady()
      })
    })
  }
})
