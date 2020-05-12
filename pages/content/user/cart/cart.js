const app=getApp()
const Util = require('../../../../utils/util.js')
const db=Util.initDb()
Page({
  data: {
    tarBarList: [
      {
        text: "主页", src: "../school_list/school_list",
        image: '../../../icon/home.png'
      },
      {
        text: "购物车", src: "../cart/cart",
        image: '../../../icon/cart_selected.png',
        color:'#FD780F'
      },
      {
        text: "我的", src: "../back/back",
        image: '../../../icon/mine.png'
      },
    ],
    empty: false,
    total_price: 0,
    cart: null,
    good: null,
    tempFilePath:null,
  },
  onLoad(){
    this.setCart();
    this.setGood();
    this.setTempFilePath();
  },
  onHide(){
    console.log('hide')
    this.update();
  },
  // 获取购物车信息
  setCart(){
    db.collection('cart')
      .where({
        _openid: app.globalData.openid
      })
      .get()
      .then(res => {
        // console.log(res.data)
        if(res.data.length==0){
          this.setData({
            empty: true
          })
        }
        this.setData({
          cart: res.data
        })
      })
  },
  // 获取商品价格、名称信息
  setGood(){
    let interval = setInterval(()=>{
      let cart = this.data.cart;
      if (cart != null) {
        for(let i=0; i<cart.length;i++){
          db.collection('good')
            .where({
              g_id: cart[i].g_id
            })
            .get()
            .then(res=>{
              this.setData({
                ['good['+i+']']: res.data[0]
              })
            })
        }
        // console.log(this.data.good)
        clearInterval(interval);
      }
    },500)
  },
  // 获取商品图片信息
  setTempFilePath(){
    let interval = setInterval(()=>{
      let good = this.data.good;
      if(good != null){
        let arr = [];
        for(let i=0; i<good.length; i++){
          wx.cloud.downloadFile({
            fileID: good[i].g_imageFileID[0]
          })
          .then(res=>{
            this.setData({
              ['tempFilePath['+i+']']: res.tempFilePath
            })
          })
        }
        // console.log(this.data.tempFilePath)
        clearInterval(interval)
      }
    },500)
  },
  // 修改数量g_num
  changeNum(e){
    let num = e.detail.num;
    let index = e.detail.index;
    console.log(index)
    this.setData({
      ['price['+index+']']: this.data.good[index].g_price * num,
      ['g_num['+index+']']: num
    })
    console.log(this.data.price)
    this.getTotalPrice();
  },
  // 当数量为0时触发
  getZero(e){
    let index = e.detail.index;
    let that = this;
    wx.showModal({
      title: '提示！',
      content: '确认将该商品从购物车中移除吗？',
      success(res){
        if (res.confirm){
          db.collection('cart')
            .where({
              _openid: app.globalData.openid,
              g_id: that.data.cart[index].g_id,
            })
            .remove()
            .then(res => {
              wx.navigateTo({
                url: '../cart/cart',
              })
            })
        }
      }
    })
  },
  // 计算总价
  getTotalPrice(){
    let price = this.data.price;
    let total = 0;
    for(let i=0; i<price.length; i++){
      total += price[i];
    }
    // console.log(total)
    this.setData({
      total_price: total.toFixed(2)
    })
  },
  // 跳转到支付页
  toPay(){
    wx.navigateTo({
      url:'../pay/pay?total_price='+this.data.total_price
    })
  },
  // 保存数量
  update(){
    for(let i=0; i<this.data.cart.length; i++){
      console.log(this.data.g_num[i])
      db.collection('cart')
        .where({
          _openid: app.globalData.openid,
          g_id: this.data.cart[i].g_id,
        })
        .update({
          data:{
            g_num: this.data.g_num[i]
          }
        })
    }
  }
})