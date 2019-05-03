import YrobotTouch from "../../utils/YrobotTouch";

const refresh_per_lenght = 2.5, trigger_length = refresh_per_lenght * 70, trigger_rotate = 1;

Component({
  options: {
    multipleSlots: true
  },

  properties: { //函数钩子：refreshtrigger、loadmoretrigger
    scrollprop: {
      type: Object,
      value: {
        "scroll-top": 0,
        "scroll-into-view": "",
        "scroll-with-animation": false,
        "enable-back-to-top": false,
        "bindscroll": () => { },
        "bindscrolltolower": () => { },
        "bindscrolltoupper": () => { },
      },
    },
    nodata: {
      type: Boolean,
      value: false
    },
    nomore: {
      type: Boolean,
      value: true
    },
  },

  data: {
    refreshAnimation: {},
    refreshing: false,
    _scrollHeight: 0,
  },

  lifetimes: {
    ready() {
      this.__updateScrollHeight();
      const that = this;
      this._refresh_position = 0;
      this._needListenRefresh = true;
      this.load_check = true;

      new YrobotTouch(this, 'scrollListner', {
        pressMove: function (evt) {
          if (that._needListenRefresh) {
            that._updateRefreshPosition(evt.deltaY);
          }
        },
        touchEnd: function (evt) {
          if (that._needListenRefresh) {
            if (that._refresh_position == trigger_length) {
              if (that.data.refreshing) // 防抖动
                return;
              that.setData({
                refreshing: true
              });
              that.triggerEvent('refreshtrigger', {}, {});
            } else {
              that.closeRefresh();
            }
          } else if (that._refresh_position > 0) {
            that.closeRefresh();
          }
        }
      })
    },
  },

  methods: {
    _updateRefreshPosition(y) {
      if (y > 100) // 防止快速拖动产生误刷新
        return;
      if (this._refresh_position < 0 && y < 0)
        return;
      if (this._refresh_position > trigger_length && y > 0)
        return;
      this._refresh_position += y;
      if (this._refresh_position < 0)
        this._refresh_position = 0;
      else if (this._refresh_position > trigger_length)
        this._refresh_position = trigger_length;
      const rotate_deg = (trigger_rotate * this._refresh_position / trigger_length) % 1 * 360 - 180;
      var animation = wx.createAnimation({});
      animation.opacity(this._refresh_position / trigger_length).translateY(this._refresh_position / refresh_per_lenght).rotateZ(rotate_deg).step({
        duration: 0,
        timingFunction: 'linear',
      });
      this.setData({
        refreshAnimation: animation.export()
      });
      animation = null;
    },
    /**
     * @description 外部刷新结束时调用此函数结束刷新动画
     * @author Yrobot
     * @date 2019-03-31
     */
    closeRefresh() {
      let duration = 300;
      var animation = wx.createAnimation({
      })
      animation.opacity(0).translateY(0).step({
        duration,
        timingFunction: 'linear',
      })
      this._refresh_position = 0;
      this.setData({
        refreshAnimation: animation.export(),
        refreshing: false
      })
    },
    __updateScrollHeight() {
      const that = this;
      const query = wx.createSelectorQuery().in(this)
      query.select('.scroll-placeholder').boundingClientRect(function (res) {
        that.setData({
          _scrollHeight: res.height,
        })
      }).exec()
    },
    _YrobotListScroll(e) {
      const trigger = 50;
      if (this._needListenRefresh && e.detail.scrollTop > trigger) {
        this._needListenRefresh = false;
      }
      if (!this._needListenRefresh && e.detail.scrollTop <= trigger) {
        this._needListenRefresh = true;
      }
    },
    _loadmore() {
      if (!this.data.nomore) {
        //this.load_check 是为了防抖动，所以加载完成时必须调用loadfinish(),
        if (this.load_check) {
          this.triggerEvent('loadmoretrigger', {}, {});
          this.load_check = false;
        }
      }
    },
    /**
     * @description 外部loadmore结束时调用此函数，用于解除load的防抖动
     * @author Yrobot
     * @date 2019-03-31
     */
    loadfinish() {
      this.load_check = true;
    },
    _bindscroll(e){
      this._YrobotListScroll(e);
      this.data.scrollprop.bindscroll(e);
    },
    _bindscrolltolower(e) {
      this._loadmore();
      this.data.scrollprop.bindscrolltolower(e);
    },
    _bindscrolltoupper(e) {
      this.data.scrollprop.bindscrolltoupper(e);
    }
  },
})

