// Yrobot-toast/Yrobot-toast.js
// Yrobot设计实现toast组件，请配合Yrobot-page-holdert使用
// 时间：2018年12月20日 19:40:38


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
      if (this.timeOutID) {
        clearTimeout(this.timeOutID);
      }
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
      this.timeOutID = setTimeout(() => {
        this.setData({
          text: '',
          isShow: false,
          textAlign: 'center',
          showTime: 3000,
        })
      }, 1100 + showTime);
    },
  }
})
