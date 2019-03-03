// Yrobot-slideBar/Yrobot-slideBar.js
// Yrobot设计实现slideBar组件，请配合Yrobot-page-holdert使用
// 时间：2019年1月13日 14:23:04

import YrobotTouch from "../../utils/YrobotTouch";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否开启点击cover层,关闭slideBar,默认自动关闭
    coverClose: {
      type: Boolean,
      value: true
    },
    //statusBG是否打开
    statusBGOn: {
      type: Boolean,
      value: true
    },
    //触发YrobotTouch事件的view的宽度
    triggerWidth:{
      type: String,
      value: '100rpx'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    slideBarAnimation: {},
    statusBarHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  created() {
    const that = this;
    this.slideTranslateX = 0;
    new YrobotTouch(this, 'touchTrigger', {
      pressMove: function (evt) { //evt.deltaX和evt.deltaY代表在屏幕上移动的距离,evt.target可以用来判断点击的对象
        if (that.slideTranslateX == 0 && evt.deltaX < 0) return;
        if (that.slideTranslateX == that._slideWidth && evt.deltaX > 0) return;

        let x = that.slideTranslateX + evt.deltaX;
        if (x < 0) x = 0;
        if (x > that._slideWidth) x = that._slideWidth;
        that.slideTranslateX = x;
        var animation = wx.createAnimation({});
        animation.translateX(x).step({
          duration: 0,
          timingFunction: 'linear',
        });
        that.caverTransform(x / that._slideWidth);
        that.setData({
          slideBarAnimation: animation.export()
        });
        animation = null;
      },
      touchEnd: function (evt) { //在touch结束触发，evt.direction代表滑动的方向 ['Up','Right','Down','Left']
        if (evt.direction == 'Left') {
          if ((that._slideWidth - that.slideTranslateX) > that._slideWidth / 4) // 当滑动大于1/4，就切换状态
            that.hide();
          else
            that.show();
        }
        else if (evt.direction == 'Right') {
          if (that.slideTranslateX > that._slideWidth / 4) // 当滑动大于1/4，就切换状态
            that.show();
          else
            that.hide();
        }
      }
    })
  },
  ready() {
    const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;
    this.setData({
      statusBarHeight,
    });
    this.updateWidth();
  },
  methods: {
    caverTransform(opacity){
      this.selectComponent('#_YrobotSlideBar_popup').BGtransform(opacity);
    },
    show() {
      this.selectComponent('#_YrobotSlideBar_popup').showBG();
      var animation = wx.createAnimation({
      })
      animation.translateX('100%').step({
        duration: 300,
        timingFunction: 'linear',
      })
      this.setData({
        slideBarAnimation: animation.export()
      })
      animation = null;
      this.slideTranslateX = this._slideWidth;
    },
    hide() {
      this.selectComponent('#_YrobotSlideBar_popup').hideBG();
      var animation = wx.createAnimation({
      })
      animation.translateX(0).step({
        duration: 300,
        timingFunction: 'linear',
      })
      this.setData({
        slideBarAnimation: animation.export()
      })
      animation = null;
      this.slideTranslateX = 0;
    },
    updateWidth() {
      const that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('.YrobotSlideBar').boundingClientRect(function (res) {
        that._slideWidth = res.width;
      }).exec()
    },
  }
})
