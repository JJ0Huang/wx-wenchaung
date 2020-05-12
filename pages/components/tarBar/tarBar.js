// pages/components/tarBar/tarBar.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		tarBarList:{type:Array},
		w:{type:Number,value:100}
	},

	/**
	 * 组件的初始数据
	 */
	data: {

	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		navigateTo(e){
			let src=e.currentTarget.dataset.src;
			console.log("to "+src)
			wx.navigateTo({
				url: src,
			})
		}
	}
})
