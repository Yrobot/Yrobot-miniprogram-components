//Page Object
Page({
  data: {
    dataList: [
      // {
      //   data: '',
      //   show: true,
      // }
    ],
    setStatus: {
      // BGColor: 'rgb(82, 81, 81);',
      placeHold: false
    },
    setNavigation: {
      placeHold: false
    },
    setTab: {
      placeHold: false
    },
  },
  //options(Object)
  onLoad: function (options) {
    let dataList = []
    for (let i = 0; i < 20; i++)
      dataList.push({
        data: i + '. data' + i,
        show: true,
      });
    this.setData({
      dataList
    })
  },
  onReady: function () {
    if (!this.tempScrollY) {
      this.tempScrollY = 0;
    }
  },
  onShow: function () {
    setTimeout(() => {
      this.showToast("onshow")
    }, 500);
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  onPageScroll: function () {

  },
  //item(index,pagePath,text)
  onTabItemTap: function (item) {

  },
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    let dataList = this.data.dataList;

    dataList[index].show = false;
    this.setData({
      dataList
    })
    this.showToast("删除成功")
  },
  showToast(text) {
    this.selectComponent('#YrobotToast').showToast({
      text,
      showTime: 1000,
      textAlign: 'canter'
    })
  },
  scrollTab(y) {
    this.selectComponent('#YrobotLayout').setTabBar(y < 0)
  },
  windowScroll(e) {
    const { scrollTop } = e.detail;
    this.scrollTab(scrollTop - this.tempScrollY);
    this.tempScrollY = scrollTop;
  },
});