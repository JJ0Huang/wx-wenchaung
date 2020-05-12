// pages/content/manager/application/application.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.lock)
    this.setData({
      lock: options.lock
    })
    wx.setNavigationBarTitle({
      title: '工作室认证',
    })
  },
  ReApplication() {
    let that = this;
    wx.showModal({
      title: '警告！',
      content: '确定注销此工作室,重新申请吗？',
      success(res) {
        if (res.confirm) {
          let k = 0;
          wx.showLoading({
            title: '正在注销...',
          })
          // 删除用户
          db.collection('manager')
            .where({
              _openid: app.globalData.openid
            })
            .remove()
            .then(res => {
              k++;
            })
          // 删除店铺
          db.collection('store')
            .where({
              _openid: app.globalData.openid
            })
            .remove()
            .then(res => {
              k++;
            })
          // 删除店铺商品
          db.collection('good')
            .where({
              _openid: app.globalData.openid
            })
            .remove()
            .then(res => {
              k++;
            })
          let interval = setInterval(() => {
            if (k == 3) {
              clearInterval(interval)
              wx.hideLoading()
              that.toBack();
            }
          }, 500)
        }
      }
    })
  }
})