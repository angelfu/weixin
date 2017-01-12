//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    test: {}
  },
  onLoad (option) {
    var self = this,
      url = app.globalData.baseUrl + 'goddetail/order/'
    app.infoReady(() => {
      app.getData(url, { god_id: 'c5e8bc1d2003c88e59a7f7ef95590155' }, data => {
        self.setData({
          test: data
        })
      })
    })
  }
})
