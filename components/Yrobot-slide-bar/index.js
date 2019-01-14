// Yrobot-slideBar/Yrobot-slideBar.js
// Yrobot设计实现slideBar组件，请配合Yrobot-page-holdert使用
// 时间：2019年1月13日 14:23:04


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否开启点击cover层,关闭dislog,默认自动关闭
    coverClose: {
      type: Boolean,
      value: true
    },
    //statusBG是否打开
    statusBGOn: {
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    slideBarAnimation: {},
    _slideBarOn: false,
    statusBarHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  ready() {
    const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    this.setData({
      statusBarHeight,
    })
  },
  methods: {
    show() {
      this.selectComponent('#_YrobotSlideBar_popup').showBG();
      var animation = wx.createAnimation({
      })
      animation.translateX(0).step({
        duration: 200,
        timingFunction: 'linear',
      })
      this.setData({
        _slideBarOn: true,
      }, () => {
        setTimeout(() => {
          this.setData({
            slideBarAnimation: animation.export()
          })
        }, 100);
      })
    },
    hide() {
      this.selectComponent('#_YrobotSlideBar_popup').hideBG();
      let duration = 300;
      var animation = wx.createAnimation({
      })
      animation.step({
        duration,
        timingFunction: 'linear',
      })
      this.setData({
        slideBarAnimation: animation.export()
      }, () => {
        setTimeout(() => {
          this.setData({
            _slideBarOn: false,
          })
        }, duration);
      })
    },
  }
})
