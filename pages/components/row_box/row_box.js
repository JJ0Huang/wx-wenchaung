const app = getApp()
const Util = require('../../../utils/util.js')
const db = Util.initDb();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    title: {
      type: String,
    },
    text:{ type: String, value: "" },
    imageFileID: {
      type: String,
    },
    color:{ type:String, value: 'black' }
  },
  data: {
    image_src: null,
  },
  lifetimes: {
    attached: function () {
      if (this.properties.imageFileID != ''){
        wx.cloud.downloadFile({
          fileID: this.properties.imageFileID
        })
        .then(res => {
          this.setData({
            image_src: res.tempFilePath
          })
        })
      }else{
        console.log("默认图片")
        this.setData({
          image_src: '../../../icon/err.png'
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  data: {

  },
  methods: {

  }
})