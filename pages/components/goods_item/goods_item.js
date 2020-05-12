Component({
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	properties: {
		g_name: {
			type: String
		},
		g_id: {
			type: Number
		},
		g_price:{
			type:Number
		},
    g_imageFileID:{
      type:String
    }
	},
  lifetimes: {
    attached: function () {
      if (this.properties.g_imageFileID!=''){
        wx.cloud.downloadFile({
          fileID: this.properties.g_imageFileID
        })
        .then(res=>{
          this.setData({
            g_image: res.tempFilePath
          })
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
	data:{
		/**购物车 */
		img_cart: "../../../icon/cart.png",
		img_carted: "../../../icon/carted.png",
		isInCart: false,
    g_image:"../../../icon/err.png"
	},
	methods: {
		/**【跳转】到【商品详细】 */
		toGoodDetail() {
			let url = "../good_detail/good_detail";
			let query = "?g_id=" + this.properties.g_id;
			wx.navigateTo({
				url: url + query
			})
		}
	}
})