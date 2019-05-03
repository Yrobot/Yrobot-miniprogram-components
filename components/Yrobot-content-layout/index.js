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
    // 使用自定义tabbar时使用
    // 传入pageids，在swiper中生成对应slot
    // 使用slot="swiperpage_{{id}}"将页面插入对应位置
    pageids: {
      type: Array,
      value: [],
      observer(pageids, oldVal, changedPath) {
        let pageStates = this.data.pageStates || {};
        if (this.data.defaultid === null && pageids.length > 0) {
          this.setData({
            defaultid: pageids[0]
          })
        }
        if (pageids.length > 0) {
          pageids.map(val => {
            pageStates[val] = pageStates[val] ? true : false;
          })
          this.setData({
            pageStates
          })
        }
      }
    },
    noswipe: {
      type: Boolean,
      value: false
    },
    // 默认的swiperpage打开页
    defaultid: {
      type: String,
      value: null, //默认pageids的第一个
      observer(defaultid, oldVal, changedPath) {
        let pageStates = this.data.pageStates || {};
        pageStates[defaultid] = true;
        this.setData({
          pageStates
        })
      }
    },
  },

  observers: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    tabBarAnimation: {},
    statusBar: {
      _height: statusBarH,
      BGColor: "",
      placeHold: true, //是否在contentWindow层占位，即控制contentWindow的大小
    },
    navigationBar: {
      placeHold: true,
    },
    tabBar: {
      placeHold: true,
    },
    tabBarShow: true,
    // tabBarHideY: 0,
    pageStates: {
      // "id1":false,
    },
  },

  ready() {
    this.updateHeight();
  },
  methods: {
    /**
     * @description 计算出tabBar的_height,用于动画
     * @author Yrobot
     * @date 2019年3月31日
     */
    updateHeight() {
      const that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select(".tabBarPlaceHolder").boundingClientRect(function (res) {
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
      animation.translateY((!show ? this._tabBarH : 0)).step({
        duration: 500,
        timingFunction: "ease",
      })
      this.setData({
        tabBarShow: show,
        tabBarAnimation: animation.export()
      })
    },
    swiperChange(event) {
      const { currentItemId, source } = event.detail;
      if (source === "touch") {
        // 改变页面加载状态
        let pageStates = this.data.pageStates || {};
        pageStates[currentItemId] = true;
        this.setData({
          pageStates
        });
        // 触发pageChange
        let param = {
          type: "swiper",
          id: currentItemId,
          index: this.data.pageids.indexOf(currentItemId)
        };
        this.pageChange(param);
      }
    },
    /**
     * @description 切换页面的钩子
     * @author Yrobot
     * @date 2019-03-24
     * @param {*} param 页面判定主要参考id
     */
    pageChange(param) {
      if (param.type === "swiper") {
        this.triggerEvent("changetabbar", param, {})
      } else if (param.type === "tabBar") {
        this.changeSwiper(param);
      } else {
        this.changeSwiper(param);
        this.triggerEvent("changetabbar", param, {})
      }
    },
    changeSwiper(param) {
      this.setData({
        defaultid: param.id
      });
    },
    catchfunc(e) {
    },
  }
})
