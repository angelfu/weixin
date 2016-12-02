//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    godList: []
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
        if(data.code === '200') {
          self.setData({
            godList: data.result
          })
        } else {
          alert(data.msg)
        }
      })
    })
  },
  localToDetail (event) {

  }
})
