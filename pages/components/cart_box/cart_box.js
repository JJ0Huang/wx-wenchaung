// pages/components/cart_box/cart_box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: { type: Number},
    image: { type: String, value:'' },
    num: { type: Number, value: 0 },
    text1: { type:String },
    text2: { type: String },
    text3: { type: String },
  },
  data: {
    num: 0,
  },
  observers:{
    'num':function(num){
      this.triggerEvent('changeNum',{num:num, index:this.properties.index})
    }
  },
  lifetimes: {
    attached: function () {
      this.setData({
        num: this.properties.num
      })
    },
    detached: function () {

    },
  },
  methods: {
    decrease(){
      if(this.data.num>1){
        this.setData({
          num: this.data.num-1,
        })
      }
      else if(this.data.num == 1){
        this.triggerEvent('getZero', {index: this.properties.index})
      }
    },
    increase(){
      this.setData({
        num: this.data.num+1,
      })
    }
  }
})
