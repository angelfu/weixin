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
    var self = this,
      url = 'https://wxtest.yupaopao.cn/login/'
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
          self.getAccessToken(data.code)
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
  getAccessToken (code) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/login/'
    self.globalData.access_token = wx.getStorageSync('access_token')
    if (!self.globalData.access_token) {
      self.getData(url, { code }, (token) => {
        wx.setStorageSync('access_token', token.access_token)
        self.globalData.access_token = token.access_token
      })
    }
    return self.globalData.access_token
  },
  getData (url, data, cb) {
    var self = this
    data.code ? '' : data.access_token = self.globalData.access_token
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
        } else if (res.data.code === '406') {
          self.globalData.isReady = false
          wx.redirectTo({
            url: '../index/index',
            complete () {
              self.getAccessToken(self.globalData.code)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
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
    access_token: null,
    isReady: false,
    userInfo: null,
    code: null,
    local: null
  }
})
