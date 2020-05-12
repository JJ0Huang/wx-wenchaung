const Util = require('../../../../utils/util.js');
Component({
	data:{
		goods: [],
    tarBarList: [
      {
        text: "主页", src: "../school_list/school_list",
        image: '../../../icon/home.png',
      },
      {
        text: "购物车", src: "../cart/cart",
        image: '../../../icon/cart.png'
      },
      {
        text: "我的", src: "../back/back",
        image: '../../../icon/mine.png'
      },
    ],
	},
	methods:{
		/**需要传入【st_id】【st_name】 */
		onLoad(query){
			let st_id = Number(query.st_id);
			let st_name =query.st_name;
			wx.setNavigationBarTitle({ title: st_name });
			this.getGoodsInfo(st_id);
		},
		/**获取【good】数据库里的数据 */
		getGoodsInfo(st_id){
			let db = Util.initDb();
			db.collection("good")
				.where({
					st_id: st_id
				})
				.get()
				.then(res => {
					console.log(res.data);
					this.setData({
						goods: res.data
					})
				})
		}
	}
})