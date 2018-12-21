# Yrobot-miniprogram-components
Yrobot的微信小程序的组件库

## 1. slide-view : 列表滑动组件
详见组件的index.js的属性，以及demo1的应用案例

## 2. Yrobot-toast : 文字提示框
引用page页：
- .json：
```
    "usingComponents": {
        "toast-view": "/components/Yrobot-toast/index"
    }
```
- .wxml:
```
    <toast-view id="YrobotToast"></toast-view>
```
- .js:
```
    this.selectComponent('#YrobotToast').showToast({
      text:'提示信息', //提示信息内容
      showTime: 1000, //提示内容停留时间
      textAlign: 'canter' //提示内容对齐方式(存在换行时)
    })
```