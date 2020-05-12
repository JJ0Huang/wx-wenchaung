// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init('test-0fbrj')
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('good').doc(event._id).update({
      data: {
        g_name: event.g_name,
        g_price: event.g_price,
        g_describe: event.g_describe
      }
    })
  } catch (e) {
    console.error(e)
  }
}