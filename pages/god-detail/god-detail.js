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
    var self = this,
      url = 'https://wxtest.yupaopao.cn/goddetail/'

    app.infoReady(() => {
      app.getData(url, { god_id: option.id }, data => {
        self.setData({
          godDetail: data.god_detail,
          commentList: data.rate_list
        })
      })
    })
  }
})
