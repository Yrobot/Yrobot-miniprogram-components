// Yrobot-popup/Yrobot-popup.js
// Yrobot设计实现popup组件,此组件为各类弹窗层的基础
// 时间：2018年12月21日 13:10:49

// 内容层Zindex：2
// 弹窗遮蔽层Zindex：1000
// 弹窗内容层Zindex > 1000
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // cover层是否开启
    coverOn: {
      type: Boolean,
      value: true
    },
    // cover层的颜色
    coverColor: {
      type: String,
      value: "rgba(37, 37, 37, 0.6)",
    },
    // slot为float时，一下4个属性用来设置弹窗位置（可用%、rpx）
    left: {
      type: String,
      value: "auto"
    },
    right: {
      type: String,
      value: "auto"
    },
    top: {
      type: String,
      value: "auto"
    },
    bottom: {
      type: String,
      value: "auto"
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
  methods: {

  }
})
