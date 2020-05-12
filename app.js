//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
		this.getSetting();
	},
	/** 获取用户信息*/
	getSetting(){
    console.log("正在获取您的userInfo")
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					wx.getUserInfo({
						success: res => {
							this.globalData.userInfo = res.userInfo
							console.log("Your uerInfo is:")
							console.log(res.userInfo)
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					})
				}
			}
		})
	},
  globalData: {
		openid:null,
    userInfo: null,
		total_price:0,
    store:{},
  },
	watch:{
		'total_price':function(){
			console.log("change")
		}
	}
})