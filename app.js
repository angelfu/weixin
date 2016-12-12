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

      self.getAccessToken(() => {
        wx.getUserInfo({
          success: function (res) {
            self.globalData.userInfo = res.userInfo
            self.globalData.isReady = true
            typeof cb == "function" && cb()
          },
          fail (res) {
            self.failMsg('获取用户信息失败 请重试')
          }
        })
      })
    }
  },
  getAccessToken (cb) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/login/'

    wx.login({
      success: function (data) {
        self.globalData.code = data.code
        self.getData(url, { code: data.code }, (token) => {
          wx.setStorageSync('access_token', token.access_token)
          self.globalData.access_token = token.access_token
          typeof cb == "function" && cb(token.access_token)
        })
      },
      fail (res) {
        self.failMsg('登录失败 请重试')
      }
    })
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
          self.getAccessToken(() => {
            wx.redirectTo({
              url: '../index/index'
            })
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
        self.failMsg('网络错误 请重试')
      }
    })
  },
  failMsg (text) {
    wx.showModal({
      title: '错误',
      content: text,
      success: function(res) {
        wx.redirectTo({
          url: '../index/index'
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
