// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init('test-0fbrj')
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('store')
      .doc(event._id)
      .update({
        data: {
          lock: false
        }
      })
  } catch (e) {
    console.error(e)
  }
}