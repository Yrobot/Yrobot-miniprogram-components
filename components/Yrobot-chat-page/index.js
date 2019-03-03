// Yrobot-chat-page/Yrobot-chat-page.js
// 主要功能包括：
// 1. 提供navigationBar、messagesHolder、inputArea、popHolder接口
// 2. 中间messageHolder封装scroll-view，利用methods更简单的控制业务逻辑
// 3. inputArea提供给底部的输入栏，利用suitKeyBoard()方法传入键盘的高，让组件自适应键盘高度，实现微信聊天键盘弹起的效果
//
//
const maxScroll = 99999;

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
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
    // 因为wx获取元素高度不精确的问题暂用的参数，用于和聊天背景融合，不出现白边
    contentBGC: { 
      type: String,
      value: '#ffffff'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _pageBottom: 0,
    _scrollHeight: undefined,
    _scrollTop: 0,
  },

  /**
   * 组件的方法列表
   */
  ready() {
    this._updateScrollHeight();
    this.scrollTo(maxScroll);
  },
  methods: {
    /**
     * @description 计算scroll-view应有的height，因为scroll-view必须有确定的高度才可以正确滚动到指定位置
     * @author Yrobot
     * @date 2019-01-26
     */
    _updateScrollHeight() {
      const that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('.contentWindow').boundingClientRect(function (res) {
        that.setData({
          _scrollHeight: res.height,
        })
        that._fullScrollHeight = res.height;
      }).exec()
    },
    /**
     * @description 改变页面和scroll-view的高度，适应键盘弹起
     * @author Yrobot
     * @date 2019-01-27
     * @param {*} height 键盘高度 / 0
     */
    suitKeyBoard(height) {
      this.setData({
        _pageBottom: height,
        _scrollHeight: this._fullScrollHeight - height,
      })
    },
    scrollTo(top) {
      this.setData({
        _scrollTop: top,
      })
    },
  }
})
