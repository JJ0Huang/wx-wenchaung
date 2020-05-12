const Util = require('../../../../utils/util.js')
const db = Util.initDb()
const app = getApp()
Component({
	data:{
		s_index:null,
		s_name:"",
		st_name:null,
		st_boss:null,
    st_WXID: null,
    st_logo: null,
    tempsrc: '../../../../icon/mine.png',

		s_array:[{s_id:0,s_name:"xxx大学"}]
	},
	methods:{
		onLoad(){
			this.getSchoolsInfo();
		},
		/**获取【school】中所有的学校 */
		getSchoolsInfo(){
			let db=Util.initDb();
			db.collection("school")
				.get()
				.then(res=>{
					console.log(res.data);
					this.setData({
						"s_array":res.data
					})
				})
		},
		/**选择器选择学校 */
		pickSchool(e){
			let index = e.detail.value;
			let s_name=this.data.s_array[index].s_name;
			this.setData({
				"s_name":s_name,
				"s_index":index
			})
		},
		/**提交申请,要提交的信息有【s_id】【st_id】【st_name】【st_boss】*/
		submitInfo(){
			let s_id=null;
      let that = this;
			let st_id = Util.random();
			let st_name=this.data.st_name;
			let st_boss=this.data.st_boss;
			let s_array=this.data.s_array;
			let index=this.data.s_index;

			s_id=s_array[index].s_id;

			// 将【st_id】【s_id】【st_name】【st_boss】填入【store】数据库中
			db.collection("store")
				.add({
					data:{
						st_id: st_id,
						s_id: s_id,
						st_name: st_name,
						st_boss: st_boss,
            st_logo: that.data.st_logo,
            application: that.data.fileID,
            lock: true,
            describe: that.data.describe
					}
				})
				.then(res=>{
					console.log(res)
				})
			// 将【m_name】【st_id】写入到【manager】里
			db.collection("manager")
				.add({
					data:{
            userInfo:app.globalData.userInfo,
						m_name:st_boss,
						st_id:st_id
					}
				})
				.then(res=>{
					console.log(res)
					wx.reLaunch({
						url: '../../../index/index',
					})
				})
		},
		/**获取输入框中的数据 */
		getStoreName(e) {
			this.setData({
				"st_name": e.detail.value
			})
		},
    chooseLogo(){
      let that = this;
      wx.chooseImage({
        success: function (res) {
          wx.showLoading({
            title: '上传中...',
          })
          console.log(res.tempFilePaths[0])
          that.setData({
            tempsrc: res.tempFilePaths[0]
          })
          wx.cloud.uploadFile({
            cloudPath: String(Util.formatTime(new Date())),
            filePath: that.data.tempsrc,
            success(res){
              that.setData({
                st_logo:res.fileID
              })
              wx.hideLoading()
            }
          })
        },
      })
    },
    getStoreWXID(e){
      this.setData({
        "st_WXID": e.detail.value
      })
    },
		getStoreBoss(e) {
			this.setData({
				"st_boss": e.detail.value
			})
		},
    // 获取上传的图片的FileID
    getFileIDArray(e){
      this.setData({
        fileID: e.detail.fileID
      })
    },
    getStoreDescribe(e){
      this.setData({
        describe: e.detail.value
      })
    }
	}
})