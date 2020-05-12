// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init('test-0fbrj')
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  if (event._fun == 'update') {
    try {
      return await db.collection('order').doc(event._id).update({
        data: {
          status: event.status
        }
      })
    } catch (e) {
      console.error(e)
    }
  } else if (event._fun == 'remove') {
    try {
      return await db.collection('order').doc(event._id).remove()
    } catch (e) {
      console.error(e)
    }
  }
}