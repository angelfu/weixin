//app.js
App({
  onLaunch () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [],
      self = this
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  infoReady (cb) {
    var self = this
    if (self.globalData.isReady) {
      typeof cb == "function" && cb()
    } else {
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          self.globalData.local = res
        }
      })
      wx.login({
        success: function (data) {
          self.globalData.code = data.code
          wx.getUserInfo({
            success: function (res) {
              self.globalData.userInfo = res.userInfo
              self.globalData.isReady = true
              typeof cb == "function" && cb()
            }
          })
        }
      })
    }
  },
  getData (url, data, cb) {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        typeof cb === 'function' && cb(res.data)
      }
    })
  },
  globalData: {
    isReady: false,
    userInfo: null,
    code: null,
    local: null
  }
})
