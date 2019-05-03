// Yrobot-popup/Yrobot-popup.js
// Yrobot设计实现popup组件,此组件为各类弹窗层的基础
// 时间：2018年12月21日 13:10:49

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // bind:coverClose 点击coverBG触发的函数,一般设置为关闭函数
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
    // left: {
    //   type: String,
    //   value: "auto"
    // },
    // right: {
    //   type: String,
    //   value: "auto"
    // },
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
    //背景显隐动画
    BGanimation: {},
    _BGon: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showBG() {
      clearTimeout(this._hide_timeOut);
      var animation = wx.createAnimation({
      })
      animation.opacity(1).step({
        duration: 200,
        timingFunction: 'linear',
      })
      if (this.data._BGon) {
        this.setData({
          BGanimation: animation.export()
        })
        animation = null;
      } else {
        this.setData({
          _BGon: true,
        }, () => {
          this._show_timeOut = setTimeout(() => {
            this.setData({
              BGanimation: animation.export()
            })
            animation = null;
          }, 100);
        })
      }
    },
    hideBG() {
      clearTimeout(this._show_timeOut);
      let duration = 300;
      var animation = wx.createAnimation({
      })
      animation.opacity(0).step({
        duration,
        timingFunction: 'linear',
      })
      this.setData({
        BGanimation: animation.export()
      }, () => {
        this._hide_timeOut = setTimeout(() => {
          this.setData({
            _BGon: false,
          })
          animation = null;
        }, duration);
      })
    },
    tapCover() {
      this.triggerEvent('coverClose', {}, {});
    },
    BGtransform(opacity) {
      if (!this.data._BGon && opacity > 0) { //最开始的需要先display：block
        this.setData({
          _BGon: true,
        })
      } else {
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        var animation = wx.createAnimation({
        })
        animation.opacity(opacity).step({
          duration: 0,
          timingFunction: 'linear',
        })
        this.setData({
          BGanimation: animation.export()
        })
        animation = null;
      }
    },
  },
})
