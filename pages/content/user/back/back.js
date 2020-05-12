const app = getApp()
Component({
  data: {
    userInfo: null,
    icons: [{
        src: '../../../../icon/1_15.png',
        text: '待付款'
      },{
        src: '../../../../icon/1_12.png',
        text: '待发货'
      },{
        src: '../../../../icon/1_09.png',
        text: '待收货'
      },{
        src: '../../../../icon/1_06.png',
        text: '待评价'
      },{
        src: '../../../../icon/1_03.png',
        text: '已退款'
      }
    ],
    tarBarList: [{
        text: "主页",
        src: "../school_list/school_list",
        image: '../../../icon/home.png'
      },
      {
        text: "购物车",
        src: "../cart/cart",
        image: '../../../icon/cart.png'
      },
      {
        text: "我的",
        src: "../back/back",
        image: '../../../icon/mine_selected.png',
        color: '#FD780F'
      },
    ],
  },
  methods: {
    onReady() {
      console.log(app.globalData.userInfo)
      this.setData({
        "userInfo": app.globalData.userInfo
      })
    },
    toEditAddress() {
      wx.chooseAddress({
        success(res) {
          console.log(res)
        }
      })
    },
    // 跳转到用户订单
    toUserOrder(e) {
      wx.navigateTo({
        url: '../userOrder/userOrder?_src='+e.currentTarget.dataset._src,
      })
    },
    toBack() {
      wx.reLaunch({
        url: '../../../index/index',
      })
    }
  }
})