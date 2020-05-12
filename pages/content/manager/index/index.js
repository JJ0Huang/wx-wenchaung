const Util = require('../../../../utils/util.js')
const db = Util.initDb()
const app = getApp()
Component({
  data: {
    icons: [{
      src: '../../../../icon/ai_09.png',
      text: '工作室认证',
      to: ''
    }, {
      src: '../../../../icon/ai_06.png',
      text: '商品管理',
      to: '../store/index/index'
    }, {
      src: '../../../../icon/ai_03.png',
      text: '订单管理',
      to: '../order/order'
    }, ],
    tarBarList: [{
        text: "我的工作室",
        src: "",
        image: "../../../icon/TarbarStoreSelected.png",
        color: "#08c27c"
      },
      {
        text: "设置",
        src: "../setting/setting",
        image: "../../../icon/TarbarSetting.png",
      },
    ],
    userInfo: {},
    store: null,
    Goods: null,
    TotalNum: 0,
    TotalPrice: 0,
  },
  methods: {
    onLoad() {
      this.getStoreInfo();
      this.setGlobalOpenid();
      this.getLogo();
      this.GetGoods();
      this.GetOrders();
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    },
    To(e) {
      wx.navigateTo({
        url: e.currentTarget.dataset._to,
      })
    },
    ToApplication() {
      wx.showLoading({
        title: '正在跳转...',
      })
      let interval = setInterval(()=>{
        if (this.data.store != null) {
          clearInterval(interval)
          wx.hideLoading()
          wx.navigateTo({
            url: '../application/application?lock=' + this.data.store.lock,
          })
        }
      },500)
    },
    /**获取商店ID */
    getStoreInfo() {
      let that = this;
      let interval = setInterval(() => {
        if (app.globalData.openid != null) {
          db.collection('manager')
            .where({
              _openid: app.globalData.openid
            })
            .get()
            .then(res => {
              app.globalData.store.st_id = res.data[0].st_id;
              db.collection('store')
                .where({
                  st_id: res.data[0].st_id
                })
                .get()
                .then(res => {
                  // app.globalData.store.st_name = res.data[0].st_name
                  that.setData({
                    store: res.data[0],
                    ['icons[0].to']: '../application/application?lock='+res.data[0].lock
                  })
                })
            })
          clearInterval(interval);
        }
      }, 500)
    },
    getLogo() {
      let that = this;
      let interval = setInterval(() => {
        if (that.data.store != null) {
          wx.showLoading({
            title: '加载中...',
          })
          clearInterval(interval)
          wx.cloud.downloadFile({
              fileID: that.data.store.st_logo,
            })
            .then(res => {
              that.setData({
                tempsrc: res.tempFilePath
              })
              wx.hideLoading()
            })
        }
      }, 500)
    },
    setGlobalOpenid() {
      db.collection('manager')
        .where({
          userInfo: app.globalData.userInfo
        })
        .get()
        .then(res => {
          console.log("You openid is :" + res.data[0]._openid)
          app.globalData.openid = res.data[0]._openid;
        })
    },
    GetGoods() {
      let that = this;
      let interval = setInterval(() => {
        if (that.data.store != null) {
          clearInterval(interval)
          db.collection('good')
            .where({
              st_id: that.data.store.st_id
            })
            .get()
            .then(res => {
              console.log(res.data)
              that.setData({
                Goods: res.data
              })
            })
        }
      }, 500)
    },
    GetOrders() {
      let that = this;
      let interval = setInterval(() => {
        let Goods = that.data.Goods;
        if (Goods != null) {
          clearInterval(interval)
          that.setData({
            Orders:[]
          })
          for (let i = 0; i < Goods.length; i++) {
            db.collection('order')
              .where({
                g_id: Goods[i].g_id,
                date: Util.Today()
              })
              .get()
              .then(res => {
                if(res.data.length!=0){
                  that.data.Orders.push(res.data[0])
                }
                that.setData({
                  Orders:that.data.Orders
                })
                if((i+1)==Goods.length){
                  that.SetTotal();
                }
              })
          }
        }
      }, 500)
    },
    SetTotal() {
      let that = this;
      let interval = setInterval(() => {
        let Orders = that.data.Orders;
        let TotalNum = 0;
        let TotalPrice = 0;
        if (Orders != null) {
          console.log(that.data.Orders)
          clearInterval(interval)
          for (let i = 0; i < Orders.length; i++) {
            TotalNum += Orders[i].g_num;
            TotalPrice += Orders[i].sub_total;
          }
          that.setData({
            TotalNum: TotalNum.toFixed(0),
            TotalPrice: TotalPrice.toFixed(2)
          })
        }
      }, 500)
    }
  }
})