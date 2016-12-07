//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    order: {},
    catArr: [],
    catIndex: 0,
    numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    numIndex: 0,
    time: '00:00',
    mobile: 111,
    curLocal: {id: '', name: ''},
    localList: [],
    localSearchText: '',
    searchLocalHide: true,
    countMoney: 0
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  formatTime () {
    var now = new Date()
    now.setMinutes(now.getMinutes() + 10)
    return util.formatNumber(now.getHours()) + ':' + util.formatNumber(now.getMinutes())
  },
  showLocalSearch (e) {
    var self = this
    self.setData({
      searchLocalHide: false
    })
  },
  hideLocalSearch (e) {
    var self = this
    self.setData({
      searchLocalHide: true
    })
  },
  chooseLocal (e) {
    var self = this,
      data = e.currentTarget.dataset.item.split(',')

    self.setData({
      curLocal: {id: data[0], name: data[1]}
    })
    self.hideLocalSearch()
  },
  bindPickerChange (e) {
    var self = this
    self.setData({
      catIndex: e.detail.value,
      price: self.data.order.cat_list[e.detail.value].price
    })
    self.updateMoney()
  },
  bindTimeChange (e) {
    var self = this
    self.setData({
      time: e.detail.value
    })
  },
  bindNumChange (e) {
    var self = this
    self.setData({
      numIndex: e.detail.value
    })
    self.updateMoney()
  },
  bindMobileChange (e) {
    var self = this
    self.setData({
      mobile: e.detail.value
    })
  },
  searchStore (e) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/storelist/'

    var searchText = e.detail.value
    app.infoReady(() => {
      app.getData(url, { searchText }, data => {
        console.log(data)
        self.setData({
          localList: data
        })
      })
    })
  },
  updateMoney () {
    var self = this

    self.setData({
      countMoney: self.data.price * self.data.numArr[self.data.numIndex]
    })
  },
  submitOrder () {
    var self = this,
      submitData = {
        mobile : self.data.mobile
      }
    // app.infoReady(() => {
    //   app.getData(url, { userInfo }, data => {
    //     console.log(data)
    //     self.setData({
    //       order: data
    //     })
    //   })
    // })
    wx.navigateTo({
      url: '../pay/pay'
    })
  },
  onLoad () {
    console.log('onLoad')
    var self = this,
      url = 'https://wxtest.yupaopao.cn/goddetail/order/',
      userInfo = {}
    //调用应用实例的方法获取全局数据
    app.infoReady(() => {
      userInfo = app.globalData.userInfo
      userInfo.code = app.globalData.code
      userInfo.latitude = app.globalData.local.latitude
      userInfo.longitude = app.globalData.local.longitude
      app.getData(url, { userInfo }, data => {
        self.setData({
          order: data,
          time: self.formatTime(),
          curCatName: data.cat_list[self.data.catIndex].cat_name,
          price: data.cat_list[self.data.catIndex].price
        })
        var temp = []
        data.cat_list.forEach(item => {
          temp.push(item.cat_name)
        })
        self.setData({
          catArr: temp
        })
        self.updateMoney()
      })
    })
  }
})
