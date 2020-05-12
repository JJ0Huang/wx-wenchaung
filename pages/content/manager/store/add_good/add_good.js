// pages/content/manager/store/add_good/add_good.js
const Util = require('../../../../../utils/util.js')
const db = Util.initDb()
const app = getApp()
Page({
  data: {
    tempFilePaths: []
  },
	onLoad(){
		this.getRandomID();
	},
  choose_img() {
    let that = this;
    wx.chooseImage({
      success: function(res) {
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          that.data.tempFilePaths.push(res.tempFilePaths[i])
        }
        that.setData({
          tempFilePaths: that.data.tempFilePaths
        })
      },
    })
  },
  getFileID(e){
    this.setData({
      g_imageFileID: e.detail.fileID
    })
  },
	e_name(e){
		this.setData({
			g_name: e.detail.value
		})
	},
	e_price(e){
		this.setData({
			g_price: Number(e.detail.value)
		})
	},
	e_describe(e){
		this.setData({
			g_describe: e.detail.value
		})
	},
	getRandomID(){
		let id=Util.random();
		db.collection('good')
			.where({
				g_id:id
			})
			.get()
			.then(res=>{
				if(res.data.length==0){
					this.setData({
						g_id:id
					})
				}else{
					this.getRandomID();
				}
			})
	},
  /**新增物品到商店 */
	addGood(){
    console.log(app.globalData.store.st_id)
		db.collection('good')
			.add({
				data:{
          st_id: app.globalData.store.st_id,
					g_id:this.data.g_id,
					g_name:this.data.g_name,
					g_price:this.data.g_price,
					g_describe:this.data.g_describe,
          g_imageFileID: this.data.g_imageFileID
				}
			})
			.then(res=>{
				console.log(res.data)
				wx.showToast({
					title: '新增成功',
				})
				wx.redirectTo({
					url: '../index/index',
				})
			})
	}
})