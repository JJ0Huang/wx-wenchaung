const Util = require('../../../../utils/util.js');
const app=getApp();
const db=Util.initDb();
Component({
	data:{
		g_id:null,
		img_array:[
			{"src":"../../../../icon/err.png"}
		],
		good:{},
		tarBarList:[
			{ text: "联系客服", src:'' },
      { text: "购物车", src: '../cart/cart', image: '../../../icon/cart.png' },
      { text: "立即购买", src: '', image: '../../../icon/cart.png' }
		],
		/**购物车 */
		img_cart:"../../../../icon/cart.png",
		img_carted: "../../../../icon/cart_selected.png",
		isInCart:false,
	},
	methods:{
    onShow(){
      this.isInCart_fun(this.data.g_id);
    },
		onLoad(query){
			let g_id = Number(query.g_id);
			this.setData({
				g_id: g_id
			})
			this.getGoodDetail(g_id);
			this.isInCart_fun(g_id);
		},
		/**根据【g_id】获取【商品详细】 */
		getGoodDetail(g_id){
			let db = Util.initDb();
			db.collection("good")
				.where({
					"g_id": g_id
				})
				.get()
				.then(res=>{
					console.log(res.data[0]);
					this.setData({
						"good":res.data[0]
					})
          this.getImageArray();
				})
		},
		/**显示【err.png】 */
		imgNotFound(e){
			let index=e.currentTarget.dataset.index;
			this.setData({
				['img_array['+index+'].src']: "../../../icon/err.png"
			})
		},
    getImageArray(){
      let arr=[];
      let fileID=this.data.good.g_imageFileID;
      for(let i=0;i<fileID.length;i++){
        wx.cloud.downloadFile({
          fileID: fileID[i]
        })
        .then(res=>{
          arr.push({src:res.tempFilePath})
          this.setData({
            img_array: arr
          })
          console.log(arr)
        })
      }
    },

		/**购物车 */
		isInCart_fun(g_id){
			db.collection('cart')
				.where({
					g_id:g_id,
					_openid:app.globalData.openid
				})
				.get()
				.then(res=>{
					let boo = (res.data.length==1);
					this.setData({
						isInCart: boo
					})
				})
    },
    // 新增到购物车
		addincart(){
			let that=this;
			if(this.data.isInCart==false){
				db.collection('cart')
					.add({
						data:{
							g_id: this.data.g_id,
							g_num: 1,
							checked: true
						}
					})
					.then(res=>{
						that.isInCart_fun(this.data.g_id);
            wx.showToast({
              title: '已新增到购物车中',
            })
					})
			}
		},
	}
})