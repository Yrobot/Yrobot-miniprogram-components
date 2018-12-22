# Yrobot-miniprogram-components
Yrobot的微信小程序的组件库

## 1. slide-view : 列表滑动组件
详见组件的index.js的属性，以及demo1的应用案例

## 2. popup-view : 遮蔽层组件的基础组件
引用page页： 
- .json：
```
    "usingComponents": {
      "popup-view": "../Yrobot-popup/index"
    }
```
- .wxml:   
`popup-view 属性：1.coverOn：是否有遮蔽阴影  2.coverColor：遮蔽阴影的颜色  3.top/bottom：slot为float时,弹窗插口的位置（宽度固定为100%）`   
`slot 接口：left/right/top/bottom/float`   
```
    <popup-view coverOn="{{false}}" bottom="400rpx">
        <view slot="float" class="YrobotToastHolder" animation="{{animationData}}">
            <view class="YrobotToast" style="text-align: {{textAlign}};">
                <text>{{text}}</text>
            </view>
        </view>
    </popup-view>
``` 

## 3. Yrobot-toast : 文字提示框
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

## 4. Yorbot-page-holder : 页面分隔内容层和弹窗层的容器
引用page页：
- .json：
```
    "usingComponents": {
        "page-holder": "/components/Yrobot-page-holder/index"
    }
```
- .wxml:
```
    <page-holder>
        <view class="contentHolder" slot="contentHolder">
            // 填写内容层代码块
        </view>
        <view class="popHolder"  slot="popHolder">
            // 填写弹窗层代码块
        </view>
    </page-holder>
```
.contentHolder 与 .popHolder 样式建议：  
```
    特别注意 标* 
    .contentHolder{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .popHolder{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        *z-index: auto;  不可设置为具体数值，否则会遮蔽整个content层，内部标签的zindex>1，便可以有弹窗效果
    } 
    具体参考demo1的index.wxml
```

