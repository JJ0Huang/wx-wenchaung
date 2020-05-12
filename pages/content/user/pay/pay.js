// pages/content/user/pay/pay.js
const Util = require("../../../../utils/util.js");
const db = Util.initDb();
const app = getApp();
Page({
  data: {
    address: null,
    total_price: null,
    o_id: null,
    goods: [],
  },
  onLoad(options) {
    let temp = Number(options.total_price).toFixed(2);
    this.setData({
      total_price:temp
    })
    this.getGoodInfo();
    this.setOrderID();
  },
  getGoodInfo() {
    let that = this;
    db.collection('cart')
      .where({
        _openid: app.globalData.openid,
        checked: true,
      })
      .get()
      .then(res => {
        that.setData({
          goods: res.data
        })
        console.log(that.data.goods)
      })
  },
  chooseAddress() {
    let that = this;
    wx.chooseAddress({
      success(res) {
        that.setData({
          address: res
        })
        console.log(that.data.address)
      }
    })
  },
  /**支付 */
  pay() {
    if (this.data.address != null) {
      this.deleteCart();
      wx.showToast({
        title: '支付成功',
      })
    } else {
      wx.showToast({
        title: '请先填写收获地址',
      })
    }
  },
  /**删除购物车信息 */
  deleteCart() {
    let that = this;
    for (let i = 0; i < that.data.goods.length; i++) {
      db.collection('cart')
        .where({
          _openid: app.globalData.openid,
          g_id: that.data.goods[i].g_id,
          checked: true,
        })
        .remove()
        .then(res => {
          console.log("1. 删除购物车信息成功")
        })
    }
    that.addInoOrder();
    app.globalData.total_price = 0;
    that.back();
  },
  /**添加到订单信息中 */
  addInoOrder() {
    let that = this;
    // [o_id],[g_id],[st_id],[g_name],[sum],[num],[u_address]
    for (let i = 0; i < that.data.goods.length; i++) {
      console.log("正在执行第【" + (i + 1) + "】个商品")
      db.collection('good')
        .where({
          g_id: that.data.goods[i].g_id
        })
        .get()
        .then(res => {
          let sub_total = res.data[0].g_price * that.data.goods[i].g_num;
          fun1(sub_total);
        })
      let fun1 = (sub_total) => {
        db.collection('order')
          .add({
            data: {
              o_id: that.data.o_id,
              g_id: that.data.goods[i].g_id,
              u_address: that.data.address,
              g_num: that.data.goods[i].g_num,
              sub_total: sub_total,
              status: "待发货",
              date: Util.Today()
            }
          })
          .then(res => {
            console.log("3. 订单申请成功")
          })
      }
    }
  },
  setOrderID() {
    let o_id = Util.random();
    let that = this;
    db.collection('order')
      .where({
        o_id: o_id
      })
      .get()
      .then(res => {
        if (res.data.length == 0) {
          that.setData({
            o_id: o_id
          })
          console.log("2. 订单编号创建成功：" + that.data.o_id)
        } else {
          that.setOrderID();
        }
      })
  },
  back() {
    wx.redirectTo({
      url: '../cart/cart',
    })
  }
})