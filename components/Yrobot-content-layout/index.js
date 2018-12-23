// Yrobot-layout/Yrobot-layout.js
// Yrobot设计实现layout组件，作为整个页面的内容层的layout
// 主要用于使用自定义tabBar和navigationBar的情况，即在app.json中设置"navigationStyle": "custom"
// 从上到下包含statusBar、navigationBar、pageWindow、tabBar
// 时间：2018年12月23日 12:53:39
// todo: 1.navigationBar和tabBar的显隐动画与API
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
    animationData: {},
    statusBar: {
      _height: statusBarH,
      BGColor: '',
      placeHold: true, //是否在contentWindow层占位，即控制contentWindow的大小
    },
    navigationBar: {
      _height: 0,
      placeHold: true,
    },
    tabBar: {
      _height: 0,
      placeHold: true,
    },
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
      const that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('.navigationBarHolder').boundingClientRect(function (res) {
        that.setData({
          navigationBar: {
            ...(that.data.navigationBar),
            _height: res.height
          }
        })
      }).exec()
      query.select('.tabBarHolder').boundingClientRect(function (res) {
        that.setData({
          tabBar: {
            ...(that.data.tabBar),
            _height: res.height
          }
        })
      }).exec()
    },

  }
})
