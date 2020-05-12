const Util = require("../../../../utils/util.js");
const db = Util.initDb();
const app = getApp();
Page({
  data: {
    order:[]
  },
  onLoad: function (options) {
    this.setData({
      status: options._src
    })
    this.getOrder();
  },
  ConfirmOrder(e){
    let that = this;
    db.collection('order')
      .where({
        _openid: app.globalData.openid,
        o_id: e.currentTarget.dataset.oid
      }).remove().then(res=>{
        wx.redirectTo({
          url: '../userOrder/userOrder?_src=' + that.data.status,
        })
      }).catch(e=>{
        console.log(e)
      })
  },
  // 获取订单信息
  getOrder(){
    db.collection('order')
      .where({
        _openid: app.globalData.openid
      })
      .get()
      .then(res=>{
        this.setData({
          order: res.data
        })
        for(let i=0;i<res.data.length;i++){
          push_g_id(res.data[i].g_id,i);
        }
      })
    let push_g_id = (g_id, index)=>{
      db.collection('good')
        .where({
          g_id: g_id
        })
        .get()
        .then(res=>{
          this.setData({
            ['g_name['+index+']']: res.data[0].g_name
          })
        })
    }
  },
})