// pages/content/manager/store/edit_good/edit_good.js
const Util = require('../../../../../utils/util.js')
const db = Util.initDb()
const app = getApp()
Page({
  data: {
    g_id: null,
    good: {},
    g_price_show: null,
  },
  onLoad(query) {
    this.setData({
      g_id: Number(query.g_id)
    })
    this.getGoodInfo();
  },
  getGoodInfo() {
    let g_id = this.data.g_id;
    db.collection('good')
      .where({
        g_id: g_id
      })
      .get()
      .then(res => {
        this.setData({
          good: res.data[0],
          g_price_show: String(res.data[0].g_price)
        })
      })
  },
  e_describe(e) {
    this.setData({
      ['good.g_describe']: e.detail.value
    })
  },
  e_name(e) {
    this.setData({
      ['good.g_name']: e.detail.value
    })
  },
  e_price(e) {
    this.setData({
      ['good.g_price']: Util.fix_2(e.detail.value)
    })
  },
  save_good() {
    let that = this;
    console.log(that.data.good._id)
    wx.cloud.callFunction({
      name: 'UpdateGood',
      data: {
        _id: that.data.good._id,
        g_name: that.data.good.g_name,
        g_price: that.data.good.g_price,
        g_describe: that.data.good.g_describe
      },
      success(res) {
        console.log(res)
        wx.redirectTo({
          url: '../index/index',
        })
      }
    })
  },
  delete_good() {
    db.collection('good')
      .where({
        g_id: this.data.g_id
      })
      .remove()
      .then(res => {
        if ((res.stats.removed == 1)) {
          wx.redirectTo({
            url: '../index/index',
          })
        } else {
          wx.showToast({
            title: '删除失败',
          })
        }
      })
  }
})