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
    mobile: '',
    curLocal: {id: '', name: '', address: ''},
    localList: [],
    localSearchText: '',
    searchLocalHide: true,
    countMoney: 0,
    mark: ''
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
      curLocal: {id: data[0], name: data[1], address: data[2]}
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
  bindMarkChange(e) {
    var self = this
    self.setData({
      mark: e.detail.value
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
      url = 'https://wxtest.yupaopao.cn/createorder/',
      userInfo = app.globalData.userInfo,
      orderInfo = {
        cat_id : self.data.order.cat_list[self.data.catIndex].cat_id,
        god_id: self.data.order.god_detail.god_id,
        begin_time: self.data.time,
        order_city: '上海',
        play_poi_id: self.data.curLocal.id,
        play_poi_name: self.data.curLocal.name,
        play_poi_address: self.data.curLocal.address,
        play_poi_lat: app.globalData.local.latitude,
        play_poi_lng: app.globalData.local.longitude
      }
    for (var i in orderInfo) {
      if (!orderInfo[i]) {
        console.log(i + '数据不全')
        return false
      }
    }
    if(!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(self.data.mobile)) {
      console.log('手机错误')
      return false
    }
    wx.setStorageSync('mobile', self.data.mobile)
    orderInfo.mark = self.data.mark
    userInfo.phone = self.data.mobile
    app.infoReady(() => {
      app.getData(url, { userInfo, orderInfo }, data => {
        wx.requestPayment({
           timeStamp: data.pay_result.timestamp,
           nonceStr: data.pay_result.nonce_str,
           package: data.pay_result.app_package,
           signType: 'MD5',
           paySign: data.pay_result.sign,
           success (res) {
             console.log(111 + res)
           },
           fail (res){
             console.log(222 + res)
           },
           complete (res) {
             console.log(333 + res)
           }
        })
        console.log(data)
        // wx.setStorageSync('pay_result', data.pay_result)
        // wx.navigateTo({
        //   url: '../pay/pay？play_order_id＝'+ data.play_order_id + '&user_id=' + data.user_id
        // })
      })
    })
  },
  onLoad (option) {
    console.log('onLoad')

    var self = this,
      url = 'https://wxtest.yupaopao.cn/goddetail/order/'
    //调用应用实例的方法获取全局数据
    wx.getStorage({
      key: 'mobile',
      success: function(res) {
        self.setData({
          mobile : res.data
        })
      }
    })
    app.infoReady(() => {
      app.getData(url, { god_id: option.id }, data => {
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
