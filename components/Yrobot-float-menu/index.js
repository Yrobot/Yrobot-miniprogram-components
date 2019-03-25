// 2019年3月25日 15:04:11： 由于计算floatmenu的尺寸和动画缩放存在冲突，所以改用左右屏幕判断floatmenu的方向
const { windowWidth, windowHeight } = wx.getSystemInfoSync();

Component({
  options: {
    multipleSlots: true
  },

  properties: {
  },

  data: {
    animation: {},
    _floatMenuOn: true,
    // memu的列表，格式：[{text,func},...]
    menulist: [],
    touch: {
      x: "50%",
      y: "50%"
    },
    positionStyle: ""
  },

  ready() {
    // this.measureMenu();
  },
  methods: {
    /**
     * @description 根据事件参数决定menu位置，根据menulist决定menu内容以及触发事件
     * @author Yrobot
     * @date 2019-03-25
     * @param {*} event touch事件参数
     * @param {*} menulist memu的列表，格式：[{text,func},...]
     */
    show([event, menulist]) {
      const { detail } = event;
      menulist.map((val, index) => {
        this['yrobot_menufunc' + index] = val.func;
      })
      const positionStyle = this.changePositionStyle(this.judgePositon(detail));
      this.setData({
        touch: {
          x: detail.x + "px",
          y: detail.y + "px",
        },
        menulist,
        positionStyle
      });
      this.selectComponent('#yrobot_float_menu_popup').showBG();
      var animation = wx.createAnimation({
      })
      animation.opacity(1).step({
        duration: 200,
        timingFunction: 'linear',
        transformOrigin: this._transformOrigin
      })
      this.setData({
        _floatMenuOn: true,
      }, () => {
        setTimeout(() => {
          this.setData({
            animation: animation.export()
          })
        }, 100);
      })
    },
    hide() {
      this.selectComponent('#yrobot_float_menu_popup').hideBG();
      let duration = 200;
      var animation = wx.createAnimation({
      })
      animation.opacity(0).scale(0, 0).step({
        duration,
        timingFunction: 'linear',
        transformOrigin: this._transformOrigin
      })
      this.setData({
        animation: animation.export()
      }, () => {
        setTimeout(() => {
          this.setData({
            _floatMenuOn: false,
          })
        }, duration);
      })
    },
    tryClose() {
      this.hide();
    },
    changePositionStyle(order) {
      const styles = {
        "LT": "left:0;top:0;transform-origin:left top;",
        "LB": "left:0;bottom:0;transform-origin:left bottom;",
        "RT": "right:0;top:0;transform-origin:right top;",
        "RB": "right:0;bottom:0;transform-origin:right bottom;",
      };
      const transformOrigin = {
        "LT": "left top",
        "LB": "left bottom",
        "RT": "right top",
        "RB": "right bottom",
      };
      this._transformOrigin = transformOrigin[order];
      return styles[order];
    },
    // measureMenu() {
    //   const that = this;
    //   const query = wx.createSelectorQuery().in(this)
    //   query.select('.float_menu').boundingClientRect(function (res) {
    //     that._menuWidth = res.width;
    //     that._menuHeight = res.height;
    //     console.log(res.width)
    //   }).exec()
    // },
    // judgePositon(touch) {
    //   const blankX = 50, blankY = 70;
    //   let dudgeX = true, dudgeY = true;
    //   if (touch.x + this._menuWidth > windowWidth - blankX)
    //     dudgeX = false;
    //   if (touch.y + this._menuHeight > windowHeight - blankY)
    //     dudgeY = false;
    //   return (dudgeX ? "L" : "R") + (dudgeY ? "T" : "B");
    // },
    judgePositon(touch) {
      let dudgeX = true, dudgeY = true;
      if (touch.x > windowWidth / 2)
        dudgeX = false;
      if (touch.y > windowHeight / 2)
        dudgeY = false;
      return (dudgeX ? "L" : "R") + (dudgeY ? "T" : "B");
    },
  }
})
