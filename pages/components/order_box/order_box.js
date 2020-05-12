// pages/components/order_box/order_box.js
const app = getApp()
const Util = require('../../../utils/util.js')
const db = Util.initDb();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text1: { type: String, value: "content" },
    text2: { type: String, value: "content" },
    text3: { type: String, value: "content" },
    text4: { type: String, value: "content" },
    status: { type: String, value: "content" },
    status_color: { type: String, value: "#606266" }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变状态
    changeStatus(){
      this.triggerEvent('changeStatus')
    }
  }
})
