const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return year + '_' + month + '_' + day + '_' + hour + '_' + minute + '_' + second;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**初始化云数据库函数 */
function initDb() {
  wx.cloud.init({
    env: 'test-0fbrj'
  })
  const db = wx.cloud.database();
  return db;
}

function fix_2(value) {
  var v = parseFloat(value) //强转Int，毕竟有可能返回是String类型的数字
  return parseFloat(v.toFixed(2))
}

function random() {
  return Math.floor((Math.random() * 10000) + 1)
}

function Today() {
  let date=new Date();
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return year + '/' + month + '/' + day;
}

module.exports = {
  formatTime: formatTime,
  initDb: initDb,
  fix_2: fix_2,
  random: random,
  Today: Today,
}