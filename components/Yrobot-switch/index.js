Component({
  properties: {
    width: {
      type: Number,
      value: 100
    },
    height: {
      type: Number,
      value: 60
    },
  },

  behaviors: ['wx://form-field'],

  data: {

  },

  ready() {
  },
  methods: {
    switch() {
      const value = !this.data.value;
      const name = this.data.name;
      this.setData({
        value
      });
      this.triggerEvent('switch', { name, value }, {});
    },
  }
})
