//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    orderDetail: {},
    isQuit: false
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  orderQuit (e) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/cancelorder/'
    wx.showModal({
      title: '取消订单',
      content: '当前订单正在进行中，确认取消订单',
      success: function(res) {
        if (res.confirm) {
          app.getData(url, { order_id: self.data.orderDetail.id }, data => {
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 2000
            })
            wx.redirectTo({
              url: '../order-list/order-list'
            })
          })
        }
      }
    })
  },
  onLoad (option) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/orderdetail/'

    app.infoReady(() => {
      app.getData(url, { order_id: option.id }, data => {
        self.setData({
          orderDetail: data
        })
        if (data.can_cancel) {
          self.setData({
            isQuit: true
          })
        }
      })
    })
  }
})
