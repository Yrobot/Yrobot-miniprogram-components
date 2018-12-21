// Yrobot-toast/Yrobot-toast.js
// Yrobot设计实现toast组件，请配合Yrobot-layout使用
// 时间：2018年12月20日 19:40:38

// 存在bugs: 
// 1.使用Yrobot-popup支持之后，无渐入渐出效果2018年12月22日 01:19:27

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //toast的文字对齐方式
    textAlign: {
      type: String,
      value: 'center'
    },
    //toast的展示文字
    text: {
      type: String,
      value: ''
    },
    //toast停留时间 ms
    showTime: {
      type: Number,
      value: 3000
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    isShow: false,
  },

  /**
   * 组件的方法列表
   */
  ready() {
  },
  methods: {
    /**
     * @description 显示toast
     * @author Yrobot
     * @date 2018-12-21
     * @param {*} param { 
     *               text：toast内容,
     *               showTime：停留时时间,
     *               textAlign：内容对其方式
     *            }
     */
    showToast(param) {
      const { text, showTime, textAlign } = {
        ...(this.data),
        ...param
      };
      var animation = wx.createAnimation({
      })
      animation.opacity(1).step({
        duration: 500,
        timingFunction: 'linear',
      })
      animation.opacity(0).step({
        duration: 500,
        delay: showTime,
        timingFunction: 'linear',
      })
      this.setData({
        text,
        showTime,
        textAlign,
        isShow: true,
        animationData: animation.export()
      })
      setTimeout(() => {
        this.setData({
          text: '',
          textAlign: 'center',
          showTime: 3000,
          isShow: false,
        })
      }, 1000 + showTime);
    },
  }
})
