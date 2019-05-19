// Yrobot-filter
// Yrobot设计实现filter组件，实现按步骤进行选择的筛选栏
// 时间：2019年4月17日 18:28:51

const { windowWidth, windowHeight } = wx.getSystemInfoSync();

const maxHeight = windowHeight * 0.65;

Component({
  properties: { // 钩子：closeFilter(),filterTrigger():value取消时返回为undefined
    coverClose: {
      type: Boolean,
      value: true
    },
    BGcolors: {
      type: Array,
      value: ["#ffffff", "#fcfcfc", "#f8f8f8", "#f4f4f4"],
      observer(newVal, oldVal, changedPath) {
        var BGcolors = newVal;
        for (let i = newVal.length; i < oldVal.length; i++) {
          BGcolors[i] = oldVal[i];
        }
        this.setData({
          BGcolors,
        });
      }
    },
  },

  data: {
    stepFilterAnimation: {},
    filterHeight: maxHeight,
    _filterOn: false,
    lists: [
      [],
      [],
      [],
      [],
    ],
    result: [0, -1, -1, -1],
    result_multiple: [[], [], [], []],
    maxLength: 2,
    _filter_type: "multiple",
    cansubmit_multiple: false,
  },

  created() {

  },
  ready() {

  },
  methods: {
    init() {
      this.setData({
        result: [0, -1, -1, -1],
        result_multiple: [[], [], [], []],
        lists: [
          [],
          [],
          [],
          [],
        ],
        maxLength: 2,
        _filter_type: "multiple",
        cansubmit_multiple: false,
      });
      this._filter_content = [];
      this._result_type = "default"
    },

    _updateFilterHeight() {
      const that = this
      const query = wx.createSelectorQuery().in(this)
      query.selectAll('.itemHolder').boundingClientRect(function (res) {
        var max = 0;
        res.map(val => {
          if (val.height > max)
            max = val.height;
        })
        max += 20;
        that.setData({
          filterHeight: maxHeight > max ? max : maxHeight
        })
      }).exec()
    },

    show(filterSet) {
      const { content, type, value, filter_type } = filterSet;
      this.init();
      this._filter_content = content;
      this._result_type = type;
      this._filter_type = filter_type || "multiple";
      this._pre_value = value;

      clearTimeout(this._hide_timeOut);

      this.setData({
        _filter_type: filter_type
      })

      if (this._filter_type === "step") {
        // filter_type === step
        this.value2result(value);
        this.transformContent();
      } else {
        // filter_type === multiple
        this.value2result_multiple(value);
        this.transformContent_multiple();
        this.isfinish_multiple();
      }

      this.selectComponent('#_YrobotStepFilter_popup').showBG();
      var animation = wx.createAnimation({
      })
      animation.opacity(1).step({
        duration: 200,
        timingFunction: 'linear',
      })
      this.setData({
        _filterOn: true,
      }, () => {
        this._updateFilterHeight();
        this._show_timeOut = setTimeout(() => {
          this.setData({
            stepFilterAnimation: animation.export()
          });
          animation = null;
        }, 100);
      });
    },
    hide() {
      clearTimeout(this._show_timeOut);

      let duration = 300;
      this.selectComponent('#_YrobotStepFilter_popup').hideBG();
      var animation = wx.createAnimation({
      })
      animation.opacity(0).step({
        duration,
        timingFunction: 'linear',
      })
      this.setData({
        stepFilterAnimation: animation.export()
      }, () => {
        this._hide_timeOut = setTimeout(() => {
          this.setData({
            _filterOn: false,
          });
          animation = null;
        }, duration);

      });
      this.triggerEvent('closeFilter', {}, {});
    },

    value2result_multiple(value) {
      var result_multiple = this.data.result_multiple;
      const content = this._filter_content;
      if (!value)
        return;
      for (let i = 0; i < content.length; i++) {
        for (let j = 0; j < content[i].length; j++) {
          const val = content[i][j];
          const list = value[i] || [];
          if (list.indexOf(val) > -1) {
            result_multiple[i][j] = true;
          } else {
            result_multiple[i][j] = false;
          }
        }
      }

      this.setData({
        result_multiple
      })
    },

    transformContent_multiple() {
      this.setData({
        lists: this._filter_content,
      });
    },

    /**
     * @description 将["","",""]转化为[0,1,2] 
     * @author Yrobot
     * @date 2019-04-19
     * @param {*} value
     * @returns 
     */
    value2result(value) {
      var temp = this._filter_content;
      var result = this.data.result;
      if (!value)
        return;

      for (let i = 0; i < result.length; i++) {
        if (temp instanceof Array) {
          result[i] = this.getIndex(i === 0 ? temp : temp.slice(1), value[i]);
          if (result[i] > -1) {
            temp = temp[result[i] + (i ? 1 : 0)];
          }
        } else {
          result[i] = -1;
        }
      }

      this.setData({
        result
      })
    },
    /**
     * @description 获取["",["",""],"",""]的第一层中val的index
     * @author Yrobot
     * @date 2019-04-19
     * @param {*} json
     */
    getIndex(json, value) {
      var index = -1;
      if (!value || !(json instanceof Array))
        return index;
      json.map((val, ind) => {
        const line = (val instanceof Array) ? val[0] : val;
        if (line === value)
          index = ind;
      })
      return index;
    },
    /**
     * @description 根据this._filter_content和this.data.result生成this.data.lists
     * @author Yrobot
     * @date 2019-04-19
     */
    transformContent() {
      var temp = this._filter_content;
      const result = this.data.result;
      var lists = this.data.lists;
      result.map((val, index) => {
        if (index === 0) {
          lists[0] = this.getlist(['', ...temp]);
          temp = temp[val];
        } else {
          if (val > -1) {
            lists[index] = this.getlist(temp);
            temp = temp[val + 1];
          }
        }
      })
      this.isfinish(result);

      this.setData({
        lists,
      });
    },
    /**
     * @description 获取json第一层的list列表值
     * @author Yrobot
     * @date 2019-04-19
     * @param {*} json
     * @returns 
     */
    getlist(json) {
      var list = [];
      json.map((val, index) => {
        if (index > 0) {
          list.push((val instanceof Array) ? val[0] : val)
        }
      });
      return list;
    },

    tapStep(e) {
      const { list, itemindex } = e.target.dataset;
      if (list !== undefined && itemindex !== undefined) { //点击列表时
        var result = this.data.result.map((val, index) => {
          if (index === list)
            return itemindex;
          else if (index > list)
            return -1;
          return val;
        })
        this.setData({
          result
        });
        if (this.isfinish(result)) {
          this.triggerEvent('filterTrigger', {
            value: this._result_list,
            type: this._result_type,
          }, {});
          this.hide();
        }
      }
    },
    /**
     * @description 1判断是否filter结束，2将下一层list进行设置，3结束时将result_list保存到this._result_list，并修改maxLength
     * @author Yrobot
     * @date 2019-04-18
     * @param {*} result
     * @returns 
     */
    isfinish(result) {
      var temp = this._filter_content;
      var result_list = [], finish = false, nextLIstIndex = -1, nextList = [], maxLength = 2;

      result.map((val, ind) => {
        if (val > -1) {
          const dt = temp[ind ? (val + 1) : (val)];
          if (dt instanceof Array) { //还有下一层
            maxLength = ind + 2;
            result_list.push(dt[0]);
            temp = dt;
          } else { //已经完成
            maxLength = ind + 1;
            result_list.push(dt);
            finish = true;
          }
        } else { //下一层
          if (nextLIstIndex === -1 && !finish) {
            nextLIstIndex = ind;
            maxLength = ind + 1;
            nextList = this.getlist(temp);
          }
        }
      })

      if (finish) {
        this.setData({
          maxLength,
        });
        this._result_list = result_list;
      } else {
        const lists = this.data.lists;
        lists[nextLIstIndex] = nextList;
        this.setData({
          maxLength,
          lists,
        });
      }
      return finish;
    },

    tapMultiple(e) {
      const { list, itemindex } = e.target.dataset;
      if (list !== undefined && itemindex !== undefined) { //点击列表时
        var result_multiple = this.data.result_multiple;
        result_multiple[list][itemindex] = !result_multiple[list][itemindex];
        this.setData({
          result_multiple
        })
        this.isfinish_multiple();
      }
    },

    isfinish_multiple() {
      const result_multiple = this.data.result_multiple;
      const content = this._filter_content;
      var cansubmit_multiple = true;
      for (let i = 0; i < content.length; i++) {
        var check = false;
        for (let j = 0; j < content[i].length; j++) {
          if (result_multiple[i][j]) {
            check = true;
            break;
          }
        }
        cansubmit_multiple = cansubmit_multiple && check;
      }
      this.setData({
        cansubmit_multiple
      })
    },

    submint_multiple() {
      if (this.data.cansubmit_multiple) {
        const result_multiple = this.data.result_multiple;
        const content = this._filter_content;
        var result_list = [];

        for (let i = 0; i < content.length; i++) {
          var list = [];
          for (let j = 0; j < content[i].length; j++) {
            if (result_multiple[i][j]) {
              list.push(content[i][j]);
            }
          }
          result_list[i] = list;
        }

        this.triggerEvent('filterTrigger', {
          value: result_list,
          type: this._result_type,
        }, {});
        this.hide();
      }
    },

    catchTap() { },
  }
})
