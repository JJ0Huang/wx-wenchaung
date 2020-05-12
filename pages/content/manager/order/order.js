// 订单信息包括：把哪件物品发送给谁，地址是哪里
const Util = require('../../../../utils/util.js')
const db = Util.initDb()
const app = getApp()
Page({
  data: {
    StoreGoods: null,
    UserGoods: null,
    Orders: [],
    UserInfo: [],
    TempSrc:null,
  },
  onLoad: function(options) {
    this.GetStoreGoods();
    // this.GetOrders();
    // this.GetUserGoods();
    let that = this;
    let interval = setInterval(()=>{
      if(that.data.StoreGoods!=null){
        clearInterval(interval)
        that.getOrders();
      }
    },500)
  },
  GetStoreGoods() {
    let that = this;
    db.collection('good')
      .where({
        st_id: app.globalData.store.st_id
      })
      .get()
      .then(res => {
        that.setData({
          StoreGoods: res.data
        })
        console.log("StoreGoods")
        console.log(that.data.StoreGoods)
      })
  },
  // GetOrders(){
  //   let that = this;
  //   let interval = setInterval(()=>{
  //     let StoreGoods = that.data.StoreGoods;
  //     if(StoreGoods!=null){
  //       clearInterval(interval)
  //       for (let i = 0; i < StoreGoods.length;i++){
  //         db.collection('order')
  //           .where({
  //             g_id: StoreGoods[i].g_id,
  //             status: '待发货'
  //           })
  //           .get()
  //           .then(res => {
  //             that.setData({
  //               ['Order['+i+']']: res.data[0]
  //             })
  //             console.log("Orders")
  //             console.log(res.data)
  //           })
  //       }
  //     }
  //   },500)
  // },
  // GetUserGoods(){
  //   let that = this;
  //   let interval = setInterval(() => {
  //     let Orders = that.data.Orders;
  //     if (Orders != null) {
  //       clearInterval(interval)
  //       for (let i = 0; i < Orders.length; i++) {
  //         db.collection('order')
  //           .where({
  //             g_id: Orders[i].g_id
  //           })
  //           .get()
  //           .then(res => {
  //             that.setData({
  //               ['UserGoods[' + i + ']']: res.data[0]
  //             })
  //             console.log("UserGoods")
  //             console.log(that.data.UserGoods)
  //           })
  //       }
  //       that.setData({
  //         show:true,
  //       })
  //     }
  //   }, 500)
  // },
  GetTempSrc(g_imageFileID,i){
    let that = this;
    wx.cloud.downloadFile({
      fileID: g_imageFileID
    })
    .then(res => {
      that.setData({
        ['TempSrc[' + i + ']']: res.tempFilePath
      })
    })
  },
  CancelOrder(e) {
    let _id = e.currentTarget.dataset._id
    wx.cloud.callFunction({
      name: 'Order',
      data: {
        _fun: 'update',
        _id: _id,
        status: '已退款'
      },
      success(res) {
        console.log(res)
        wx.redirectTo({
          url: '../order/order',
        })
      }
    })
  },
  SendOrder(e){
    let _id = e.currentTarget.dataset._id
    wx.cloud.callFunction({
      name: 'Order',
      data: {
        _fun: 'update',
        _id: _id,
        status:'待收货'
      },
      success(res) {
        console.log(res)
        wx.redirectTo({
          url: '../order/order',
        })
      }
    })
  },
  // 修改发货状态
  changeStatus() {
    db.collection('order')
      .where({
        o_id: this.data.Orders.o_id,
        status: "待发货"
      })
      .update({
        data: {
          status: "待收货"
        }
      })
      .then(res => {
        console.log(res)
      })
  },
  getOrders() {
    this.setData({
      Orders: [],
      UserInfo: []
    })
    let that = this;
    let j = 0;
    let getUserInfo = (openid, index) => {
      db.collection('user')
        .where({
          _openid: openid
        })
        .get()
        .then(res => {
          that.setData({
            ['UserInfo[' + index + ']']: res.data[0].userInfo
          })
          console.log(res.data[0].userInfo)
        })
    }
    let getUserGoods = (g_id, index) => {
      db.collection('good')
        .where({
          g_id: g_id
        })
        .get()
        .then(res => {
          that.setData({
            ['UserGoods[' + index + ']']: res.data[0]
          })
          that.GetTempSrc(res.data[0].g_imageFileID[0],index)
        })
    }
    for (let i = 0; i < that.data.StoreGoods.length; i++) {
      db.collection('order')
        .where({
          g_id: that.data.StoreGoods[i].g_id
        })
        .get()
        .then(res => {
          for (let k = 0; k < res.data.length; k++) {
            that.data.Orders.push(res.data[k])
            getUserInfo(res.data[k]._openid, j)
            console.log(res.data[k].g_id)
            getUserGoods(res.data[k].g_id, j)
            j++;
          }
          that.setData({
            Orders: that.data.Orders
          })
        })
    }
  }
})