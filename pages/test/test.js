// pages/test/test.js
const Util = require('../../utils/util.js');
const app = getApp();
const db = Util.initDb();
Page({
  data: {
  },
  Agree(){
    db.collection('store')
      .where({
        lock: true
      })
      .get()
      .then(res=>{
        console.log(res.data);
        for(let i=0;i<res.data.length;i++){
          console.log(res.data[i]._id)
          wx.cloud.callFunction({
            name: 'Agree',
            data: {
              _id:res.data[i]._id
            },
            success(res) {
              console.log(res)
            }
          })
        }
      })
  }
})