const app=getApp();
const Util=require('../../../../../utils/util.js')
const db=Util.initDb();
Page({
	data: {
		goods:[],
    TempSrc:[],
	},
	onReady(){
		this.getGoodInfo();
    wx.setNavigationBarTitle({
      title: '商品管理',
    })
	},
  onLoad(){
    this.GetTempSrc()
  },
  GetTempSrc(){
    let that = this;
    let interval=setInterval(()=>{
      if(that.data.goods.length!=0){
        clearInterval(interval)
        console.log(1)
        for (let i = 0; i < that.data.goods.length;i++){
          console.log(that.data.goods[i].g_imageFileID)
          wx.cloud.downloadFile({
            fileID: that.data.goods[i].g_imageFileID[0]
          })
          .then(res=>{
            that.setData({
              ['TempSrc['+i+']']:res.tempFilePath
            })
          })
        }
      }
    },500)
  },
	/**获取【goods】信息 */
	getGoodInfo(){
    this.setData({
      goods: []
    })
		let getGood_bySTID = (st_id)=>{
			db.collection('good')
			.where({
				st_id:st_id
			})
			.get()
			.then(res=>{
				console.log(res.data);
				this.setData({
					goods:res.data
				})
			})
		}
    /**因为一个store可能有多个manager，所以应该是找manager对应的st_id */
    let getSTID_byMID = ()=>{
			db.collection('manager')
			.where({
        _openid: app.globalData.openid
			})
			.get()
			.then(res=>{
				getGood_bySTID(res.data[0].st_id)
			})
		}
    getSTID_byMID();
	},
	toEdit(e){
		let url = '../edit_good/edit_good';
		let query = '?g_id=' + e.currentTarget.dataset.g_id;
		wx.redirectTo({
			url: url+query,
		})
	},
	toAddGood(){
		console.log("toAddGood")
    wx.redirectTo({
			url: '../add_good/add_good',
		})
	},
	onPullDownRefresh(){
		wx.showLoading({
			title: 'Loading...',
		});
		this.getGoodInfo(app.globalData.openid);
		wx.hideLoading();
		wx.stopPullDownRefresh();
	}
})