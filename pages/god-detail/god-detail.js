//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    isLoad: false,
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
    var self = this,
      url = app.globalData.baseUrl + 'goddetail/'

    app.infoReady(() => {
      app.getData(url, { god_id: option.id }, data => {
        self.setData({
          isLoad: true,
          godDetail: data.god_detail,
          commentList: data.rate_list
        })
      })
    })
  }
})
