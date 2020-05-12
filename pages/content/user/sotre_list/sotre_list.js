// pages/content/sotre_list/sotre_list.js
const Util = require('../../../../utils/util.js');
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		stores:[],
		goods: [],
		tarBarList: [
      { text: "主页", src: "../school_list/school_list", 
        image: '../../../icon/home_selected.png',
        color: '#FD780F' },
      { text: "购物车", src: "../cart/cart", 
        image: '../../../icon/cart.png' },
      { text: "我的", src: "../back/back", 
        image: '../../../icon/mine.png' },
		]
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onLoad(query) {
			let s_id = Number(query.s_id);
			let s_name=query.s_name;
			wx.setNavigationBarTitle({ title:s_name });
			this.getStoreList(s_id);
		},
		/**获取【某学校】的【store】数据库信息 */
		getStoreList(s_id){
			let db = Util.initDb();
			db.collection("store")
				.where({
					s_id: s_id
				})
				.get()
				.then(res => {
					console.log(res.data);
					this.setData({
						stores: res.data
					})
				})
		},
		/**跳转到【商品列表】 */
		/**传的参数有【st_id】【st_name】 */
		toGoodList(e){
			let st_id = e.currentTarget.dataset.st_id;
			let st_name = e.currentTarget.dataset.st_name;
			let url = '../good_list/good_list';
			let query = '?st_id=' + st_id + '&st_name=' + st_name;

			wx.navigateTo({
				url: url+query,
			})
		}
	}
})
