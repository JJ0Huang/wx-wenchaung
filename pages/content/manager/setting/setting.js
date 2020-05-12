// pages/content/manager/setting/setting.js
const Util = require('../../../../utils/util.js')
const db = Util.initDb()
const app = getApp()
Page({
  data: {
    tarBarList: [{
        text: "我的工作室",
        src: "../index/index",
        image: "../../../icon/TarbarStore.png",
      },
      {
        text: "设置",
        src: "../setting/setting",
        color: "#08c27c",
        image: "../../../icon/TarBarSettingSelected.png",
      },
    ],
  },
  onLoad(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  toBack() {
    wx.reLaunch({
      url: '../../../index/index',
    })
  },
  ShowDelete(){
    let that = this;
    wx.showModal({
      title: '警告！',
      content: '确定注销此工作室吗？',
      success(res){
        if(res.confirm){
          let k=0;
          wx.showLoading({
            title: '正在注销...',
          })
          // 删除用户
          db.collection('manager')
            .where({
              _openid: app.globalData.openid
            })
            .remove()
            .then(res=>{
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
          let interval=setInterval(()=>{
            if(k==3){
              clearInterval(interval)
              wx.hideLoading()
              that.toBack();
            }
          },500)
        }
      }
    })
  }
})