// Yrobot-layout/Yrobot-layout.js
// Yrobot设计实现layout组件，作为整个页面的内容层的layout
// 主要用于使用自定义tabBar和navigationBar的情况，即在app.json中设置"navigationStyle": "custom"
// 从上到下包含statusBar、navigationBar、pageWindow、tabBar
// 时间：2018年12月23日 12:53:39  
// bug：
// 1. 由于小程序获取元素高度不准确，所以采用占位元素高度先使用用户传入height，再使用计算后的_height。否则有些机型会有高度误差
const statusBarH = wx.getSystemInfoSync().statusBarHeight;
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //statusBar的style
    // *statusBar 的字体颜色是跟随navigation的，所以要在.json设置"navigationBarTextStyle": "black"
    // {
    //  BGColorn [String], //statusBar的颜色
    //  placeHold [Boolean] //是否在contentWindow层占位，即控制contentWindow的大小
    // }
    setStatus: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        if (typeof newVal == "object" && newVal != null)
          this.setData({
            statusBar: {
              ...(this.data.statusBar),
              ...(newVal)
            }
          })
      }
    },
    //navigationBar的style
    // {
    //  placeHold //是否在contentWindow层占位，即控制contentWindow的大小
    //  height // 默认占位高度
    // }
    setNavigation: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        if (typeof newVal == "object" && newVal != null)
          this.setData({
            navigationBar: {
              ...(this.data.navigationBar),
              ...(newVal)
            }
          })
      }
    },
    //tabBar的style
    // {
    //  placeHold //是否在contentWindow层占位，即控制contentWindow的大小
    //  height // 默认占位高度
    // }
    setTab: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        if (typeof newVal == "object" && newVal != null)
          this.setData({
            tabBar: {
              ...(this.data.tabBar),
              ...(newVal)
            }
          })
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabBarAnimation: {},
    statusBar: {
      _height: statusBarH,
      BGColor: '',
      placeHold: true, //是否在contentWindow层占位，即控制contentWindow的大小
    },
    navigationBar: {
      _height: 0,
      placeHold: true,
      height: 0, //px,用于初始占位
    },
    tabBar: {
      _height: 0,
      placeHold: true,
      height: 0, //px,用于初始占位
    },
    tabBarShow: true,
    // tabBarHideY: 0,
  },

  /**
   * 组件的方法列表
   */
  ready() {
    this.updateHeight();
  },
  methods: {
    /**
     * @description 计算出navigationBar和tabBar的_height，用于撑开占位view的高度
     * @author Yrobot
     * @date 2018-12-23
     */
    updateHeight() {
      // if (this.data.navigationBar.height && this.data.tabBar.height)
      //   return;
      const that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('.navigationBarHolder').boundingClientRect(function (res) {
        that.setData({
          navigationBar: {
            ...(that.data.navigationBar),
            _height: res.height
          }
        })
        that._navigationBarH = res.height;
      }).exec()
      query.select('.tabBarHolder').boundingClientRect(function (res) {
        that.setData({
          tabBar: {
            ...(that.data.tabBar),
            _height: res.height
          }
        })
        that._tabBarH = res.height;
      }).exec()
    },
    /**
     * @description 带动画控制tabBar的显示和隐藏
     * @author Yrobot
     * @date 2018-12-24
     * @param {*} show [Boolen] true=展示 / false=隐藏
     */
    setTabBar(show) {
      const now = this.data.tabBarShow;
      if (now == show)
        return;
      var animation = wx.createAnimation({
      })
      animation.translateY((!show ? this.data.tabBar._height : 0)).step({
        duration: 500,
        timingFunction: 'ease',
      })
      this.setData({
        tabBarShow: show,
        tabBarAnimation: animation.export()
      })
    },
  }
})
