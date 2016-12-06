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
      success (res) {
        if (res.data.code === '200') {
          typeof cb === 'function' && cb(res.data.result)
        }else {
          wx.showToast({
            title: '网络错误 请重试',
            icon: 'loading',
            duration: 2000
          })
        }
      },
      fail (res) {
        wx.showModal({
          title: '错误',
          content: '网络错误 请重试',
          success: function(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
  },
  globalData: {
    localSession: null,
    isReady: false,
    userInfo: null,
    code: null,
    local: null
  }
})
