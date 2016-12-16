//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    order: {},
    catArr: [],
    catIndex: 0,
    numArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    numIndex: 0,
    time: '00:00',
    dateArr: ['今天', '明天'],
    dateIndex: 0,
    mobile: '',
    curLocal: {id: '', name: '', address: ''},
    localList: [],
    localSearchText: '',
    searchLocalHide: true,
    countMoney: 0,
    mark: '',
    isSubmit: false,
    isSearch: false,
    tipText: '',
    markers: [],
    covers: []
  },
  //事件处理函数
  bindViewTap () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  formatTime (model) {
    var now = new Date()
    if (model === 0) {
      return now.getFullYear() + '-' + util.formatNumber(now.getMonth() + 1) + '-' + util.formatNumber(now.getDate())
    } else if (model === '1') {
      now.setDate(now.getDate() + 1)
      return now.getFullYear() + '-' + util.formatNumber(now.getMonth() + 1) + '-' + util.formatNumber(now.getDate())
    } else {
      now.setMinutes(now.getMinutes() + 10)
      return util.formatNumber(now.getHours()) + ':' + util.formatNumber(now.getMinutes())
    }
  },
  showLocalSearch (e) {
    var self = this
    self.setData({
      searchLocalHide: false
    })
    self.searchStore(e);
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
  bindDateChange (e) {
    var self = this
    if (self.data.dateArr[e.detail.value] === '今天') {
      self.setData({
        startTime: self.formatTime()
      })
    }else {
      self.setData({
        startTime: '00:00'
      })
    }
    self.setData({
      dateIndex: e.detail.value
    })
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
  showTip (text) {
    var self = this
    self.setData({
      tipText: text
    })
    setTimeout(() => {
      self.setData({
        tipText: ''
      })
    }, 2000)
  },
  searchStore (e) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/storelist/'
    var reqData = {
      cat_id: self.data.order.cat_list[self.data.catIndex].cat_id,
      lat: app.globalData.local.latitude,
      lng: app.globalData.local.longitude,
      search_word: e.detail.value
    }
    app.infoReady(() => {
      app.getData(url, reqData, data => {
        var tempCovers = []
        data.forEach(item => {
          tempCovers.push({
            latitude: +item.lat,
            longitude: +item.lng,
            iconPath: '../../images/icon-cover.png'
          })
        })
        self.setData({
          localList: data,
          isSearch: true,
          covers: tempCovers
        })
        console.log(self.data.covers)
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
        begin_time: self.formatTime(self.data.dateIndex)+ ' ' + self.data.time + ':00',
        order_city: '上海',
        times: self.data.numArr[self.data.numIndex],
        play_poi_id: self.data.curLocal.id,
        play_poi_name: self.data.curLocal.name,
        play_poi_address: self.data.curLocal.address,
        play_poi_lat: app.globalData.local.latitude,
        play_poi_lng: app.globalData.local.longitude
      }
    for (var i in orderInfo) {
      if (!orderInfo[i]) {
        return self.showTip('请选择地址')
      }
    }
    if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(self.data.mobile)) {
      return self.showTip('手机格式错误')
    }
    wx.setStorageSync('mobile', self.data.mobile)
    orderInfo.mark = self.data.mark
    userInfo.phone = self.data.mobile
    if (!self.data.isSubmit) {
      self.setData({
        isSubmit: true
      })
      app.infoReady(() => {
        app.getData(url, { userInfo, orderInfo }, data => {
          self.setData({
            isSubmit: false
          })
          wx.requestPayment({
             timeStamp: data.pay_result.timestamp,
             nonceStr: data.pay_result.nonce_str,
             package: 'prepay_id=' + data.pay_result.prepay_id,
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
    }
  },
  onLoad (option) {
    var self = this,
      url = 'https://wxtest.yupaopao.cn/goddetail/order/'
    self.setData({
      markers: [{
        latitude: app.globalData.local.latitude,
        longitude: app.globalData.local.longitude,
        name: '我',
        desc: '我现在的位置'
      }]
    })
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
        var temp = []
        data.cat_list.forEach(item => {
          temp.push(item.cat_name)
        })
        self.setData({
          order: data,
          time: self.formatTime(),
          startTime: self.formatTime(),
          curCatName: data.cat_list[self.data.catIndex].cat_name,
          price: data.cat_list[self.data.catIndex].price,
          catArr: temp
        })

        self.updateMoney()
      })
    })
  }
})
