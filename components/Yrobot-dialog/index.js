// Yrobot-dialog/Yrobot-dialog.js
// Yrobot设计实现dialog组件，请配合Yrobot-page-holdert使用
// 时间：2019年1月13日 14:23:27


Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //是否开启点击cover层,关闭dislog,默认自动关闭
    coverClose: {
      type: Boolean,
      value: true
    },
    //dislog背景色
    BGColor: {
      type: String,
      value: '#ffffff'
    },
    // 点击button区域自动调用hide()
    autoClose: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialogAnimation: {},
    _dialogOn: false,
  },

  /**
   * 组件的方法列表
   */
  ready() {
  },
  methods: {
    show() {
      this.selectComponent('#_YrobotDialog_popup').showBG();
      var animation = wx.createAnimation({
      })
      animation.opacity(1).step({
        duration: 200,
        timingFunction: 'linear',
      })
      this.setData({
        _dialogOn: true,
      }, () => {
        setTimeout(() => {
          this.setData({
            dialogAnimation: animation.export()
          })
        }, 100);
      })
    },
    hide() {
      this.selectComponent('#_YrobotDialog_popup').hideBG();
      let duration = 300;
      var animation = wx.createAnimation({
      })
      animation.opacity(0).step({
        duration,
        timingFunction: 'linear',
      })
      this.setData({
        dialogAnimation: animation.export()
      }, () => {
        setTimeout(() => {
          this.setData({
            _dialogOn: false,
          })
        }, duration);
      })
    },
    tryClose(){
      if (this.data.autoClose){
        this.hide();
      }
    }
  }
})
