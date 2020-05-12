// pages/components/good_row/good_row.js
Component({
	options: {
		multipleSlots: true // 在组件定义时的选项中启用多slot支持
	},
	/**
	 * 组件的属性列表
	 */
	properties: {
		good:{type:Object},
    img_src:{ type: String, value: '../../../icon/err.png'}
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
		errimg(){
			console.log("onerror")
			this.setData({
				img_src:'../../../icon/err.png'
			})
		}
	}
})
