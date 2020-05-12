//index.js
//获取应用实例
const Util = require('../../utils/util.js');
const app = getApp();
const db = Util.initDb();

Page({
  data: {
		st_id:null,
		st_name:null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
	onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
			})
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
				})
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
					})
        }
      })
    }
	},
  ToTest(){
    wx.redirectTo({
      url: '../test/test',
    })
  },
	//事件处理函数
	bindViewTap: function () {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
	/**跳转到【商家】 */
  toBusiness(){
    db.collection('manager')
      .where({
        userInfo: app.globalData.userInfo
      })
      .get()
      .then(res=>{
        let url = "../content/manager/create_store/create_store";
        if(res.data.length!=0){
          url = "../content/manager/index/index";
        }
        wx.navigateTo({
          url: url,
        })
      })
  },
	/**跳转到【用户】 */
	toUser(){
		wx.navigateTo({
			url:'../content/user/school_list/school_list'
		})
	},
	setUserInfo(res){
		let user = res.currentTarget.dataset.user;
		if (app.globalData.userInfo==null){
			app.globalData.userInfo=res.detail.userInfo;
			wx.reLaunch({
				url: '../index/index',
			})
		}else{
			if(user=="user"){
				this.toUser();
			}else if(user=="business"){
				this.toBusiness();
			}
		}
	}
})
