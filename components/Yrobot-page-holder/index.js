// Yrobot-pageHolde/Yrobot-pageHolde.js
// Yrobot设计实现pageHolde组件，来hold页面 内容部分 和 遮蔽部分
// 接入点主要包括 遮蔽层 和 内容层 
// 时间：2018年12月22日 11:08:32

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //页面距离底部的距离，常用于适配键盘弹起的情况
    bottom: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  ready() {
  },
  methods: {

  }
})
