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
    var self = this,
      url = 'https://wxtest.yupaopao.cn/godlist/',
      userInfo = {}
      app.getData(url, { }, data => {
        console.log(data)
        //更新数据
        self.setData({
          godList: data
        })
      })
      app.infoReady()
  },
  localToDetail (event) {

  }
})
