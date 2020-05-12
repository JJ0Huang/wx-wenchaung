const app = getApp()
const Util = require('../../../utils/util.js')
const db = Util.initDb();
Component({
  properties: {
    BaseImage: { type: String, value:'../../../icon/img_add.png'},
    MaxNumber: {type: Number,value: 20}
  },

  data: {
    images: [],
    fileID: [],
  },

  methods: {
    // 选择图片
    chooseimage() {
      let that = this;
      let arr = [];
      wx.chooseImage({
        success(res) {
          wx.showLoading({
            title: '上传中...',
          })
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            arr.push(res.tempFilePaths[i])
            cloudUpload(res.tempFilePaths[i], i);
          }
          for(let k=0;k<that.data.images.length;k++){
            arr.push(that.data.images[k])
          }
          that.setData({
            images: arr
          })
          wx.hideLoading()
        },
      })
      // 上传到云存储里面
      let cloudUpload = (tempFilePath, i) => {
        wx.cloud.uploadFile({
          cloudPath: String(Util.formatTime(new Date())) + '_' + String(i),
          filePath: tempFilePath,
          success(res) {
            that.data.fileID.push(res.fileID);
            that.setData({
              fileID: that.data.fileID
            })
            that.triggerEvent('_getFileID', {
              fileID: that.data.fileID
            });
            // getPreviewImage();
          },
          fail(err){
            wx.showModal({
              title: '警告！',
              content: '第' + i + '张图上传失败，请再次上传',
            })
          }
        })
      }
      // 获取图像的压缩图 ------------------未使用
      let getPreviewImage = () => {
        let fileID = that.data.fileID;
        let arr = [];
        for (let i = 0; i < fileID.length; i++) {
          wx.cloud.downloadFile({
            fileID: fileID[i],
            success(res) {
              arr.push(res.tempFilePath)
              that.setData({
                images: arr
              })
            }
          })
        }
      }
    }
  },
})