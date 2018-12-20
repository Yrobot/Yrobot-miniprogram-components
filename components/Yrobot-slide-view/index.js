// slide-view/slide-view.js
// Yrobot修改官方的slideView组件，修复了若干bugs，添加几个功能
// bugs: 1.打开状态左滑会自动关闭 2.右滑不自动关闭
// 功能：1.添加控制出界的属性 2.添加点击右侧关闭滑块
// 时间：2018年12月19日 21:37:37
const _windowWidth = wx.getSystemInfoSync().windowWidth // (px)
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true,
  },
  properties: {
    //  组件显示区域的宽度 (rpx)
    width: {
      type: Number,
      value: 750 // 750rpx 即整屏宽
    },
    //  组件显示区域的高度 (rpx)
    height: {
      type: Number,
      value: 0,
    },
    //  组件滑动显示区域的宽度 (rpx)
    slideWidth: {
      type: Number,
      value: 0
    },
    //  组件右滑是否可以越界
    slideOut: {
      type: Boolean,
      value: false
    },
    //  右侧点击事件是否会自动关闭滑块
    rightClickNoclose: {
      type: Boolean,
      value: false
    },
    //  尝试通过设置setX来更新x值，从而控制slideView的开关，但是父元素触发setX修改会有覆盖的情况，造成第二次设置一样时更新失败
    // setX: {  
    //   type: Number,
    //   value: 0,
    //   observer(newVal, oldVal, changedPath) {
    //     if (newVal > 0)
    //       console.error('slide-view.setX > 0 : ' + newVal);
    //     //不做判断，因为x变化后不会更新setX
    //     this.setData({
    //       x: newVal
    //     })
    //   }
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    viewWidth: _windowWidth, // (rpx)
    //  movable-view偏移量
    x: 0,
    //  movable-view是否可以出界
    out: false,
  },

  /**
   * 组件的方法列表
   */
  ready() {
    this.updateRight();
  },
  methods: {
    updateRight() {
      // 获取右侧滑动显示区域的宽度 将rpx转换为px 用于滑动自动完成的判断（因为x单位是px）
      const that = this
      const query = wx.createSelectorQuery().in(this)
      query.select('.right').boundingClientRect(function (res) {
        that._slideWidth = res.width
        that._threshold = res.width / 2
        that._viewWidth = that.data.width + res.width * (750 / _windowWidth)
        that.setData({
          viewWidth: that._viewWidth //data.width+slideWidth
        })
      }).exec()
    },
    onTouchStart(e) { //e.changedTouches[0]：触发事件时，手指的位置，相对于整个页面左上角的位置（client时相对于视口左上角的位置）
      this._startX = e.changedTouches[0].pageX
    },
    //  当滑动范围超过阈值自动完成剩余滑动
    onTouchEnd(e) {
      this._endX = e.changedTouches[0].pageX
      const { _endX, _startX, _threshold } = this
      // if (_endX > _startX && this.data.out === false) return //右滑 & 不可出界 ???
      if (_startX - _endX >= _threshold) { //左滑 大于一半slideWidth
        this.setData({
          x: -this._slideWidth
        })
      } else if (_startX - _endX < _threshold && _startX - _endX > 0) { //左滑 小于一半slideWidth
        this.setData({
          x: this.data.x //不能直接设为0，因为还有打开时的左移情况
        })
      } else if (_endX - _startX >= _threshold) {//右滑 大于一半slideWidth
        this.setData({
          x: 0
        })
      } else if (_endX - _startX < _threshold && _endX - _startX > 0) {//右滑 小于一半slideWidth
        this.setData({
          x: this.data.x //不能直接设为0，因为还有打开时的左移情况
        })
      }
    },
    //  根据右侧slide的开关设定是否允许movable-view出界
    //  只有右侧打开时才可越界，所以左滑时没有越界效果的
    onChange(e) {
      if (!this.data.slideOut) return; //设定不可越界时退出判断
      if (!this.data.out && e.detail.x < -this._threshold) { //slide为On的状态
        this.setData({
          out: true
        })
      } else if (this.data.out && e.detail.x >= -this._threshold) { //slide为Off的状态
        this.setData({
          out: false
        })
      }
    },
    closeSlide() {
      this.setData({
        x: 0
      })
    },
    //  尝试关闭slide
    tryToCloseSlide() {
      if (!this.data.rightClickNoclose)
        this.closeSlide();
    },
  }
})
