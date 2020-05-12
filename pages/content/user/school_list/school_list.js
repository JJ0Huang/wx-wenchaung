// pages/content/school_list/school_list.js
const Util = require("../../../../utils/util.js");
const db=Util.initDb();
const app=getApp();
Component({
	properties: {

	},
	data: {
		schools:[],
		tarBarList:[
			{ text: "主页", src: "../school_list/school_list", 
        image: '../../../icon/home_selected.png',
        color: '#FD780F' },
      { text: "购物车", src: "../cart/cart", 
        image: '../../../icon/cart.png' },
      { text: "我的", src: "../back/back", 
        image: '../../../icon/mine.png' },
		],
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		onLoad(){
			this.isNewUser();
		},
		/**用户判断 */
		isNewUser(){
			let that=this;
			db.collection('user')
				.where({
          userInfo: app.globalData.userInfo
				})
				.get()
				.then(res=>{
					if (res.data.length == 0){
						that.initUser()
					}else{
            console.log("你的openid是：" + res.data[0]._openid)
            app.globalData.openid = res.data[0]._openid;
          }
				})
		},
		initUser(){
      let that = this;
			db.collection('user')
				.add({
					data:{
						userInfo: app.globalData.userInfo
					}
				})
				.then(res=>{
					wx.showToast({
            title: '账号初始化完毕',
          })
          that.setAppOpenid(res._id)
				})
		},
    setAppOpenid(_id){
      db.collection('user')
        .where({
          _id:_id
        })
        .get()
        .then(res => {
          console.log("你的openid是：" + res.data[0]._openid)
          app.globalData.openid = res.data[0]._openid;
        })
    },
		/**跳转到【商品】页面 */
		/**传的参数有【s_id】【s_name】 */
		toStoreList(e){
			let s_id=e.currentTarget.dataset.s_id;
			let s_name = e.currentTarget.dataset.s_name;
			let url = '../sotre_list/sotre_list';
			let query='?s_id='+s_id+'&s_name='+s_name;
			
			wx.navigateTo({
				url: url+query,
			})
		},
		/**准备数据 */
		onReady() {
			this.getSchoolInfo();
		},
		/**获取【school】云数据库的数据 */
		getSchoolInfo(){
			let db = Util.initDb();
			db.collection("school")
				.get()
				.then(res => {
					console.log(res.data);
					this.setData({
						schools:res.data
					})
				})
		}
	}
})
