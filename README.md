# Yrobot-miniprogram-components
Yrobot的微信小程序的组件库

## 1. slide-view : 列表滑动组件
可以实现类似于对话列表滑动出现删除按钮的场景  
详见组件的index.js的属性，以及demo1的应用案例

## 2. popup-view : 遮蔽层组件的基础组件
1. 2019年1月14日 添加遮蔽层的显隐动画调用函数控制
2. 2019年1月14日 添加遮蔽层的点击事件的钩子函数，用于控制点击遮蔽层关闭事件  
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
1. 2019年3月24日 10:38:03 添加bottom属性，用于键盘弹起时页面高度的适配  
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

## 5. Yrobot-content-layout : 页面内容的布局容器  
1. 主要将页面的内容部分分为：statusBar、navigationBar、contentWindow、tabBar四个部分  
利用组件参数和事件可以很好的控制contentWindow的大小，从而很快的实现全页面展示、快速隐藏tabBar和navigationBar等效果  
- 主要参数：`setStatus:{}, setNavigation:{}, setTab:{}`  

2. 因为自定义tabBar切换时闪烁的问题，本组件决定用单页面应用的形式来解决，利用swiper作为页面容器填充contentWindow的位置，将页面以组件的形式，利用slot: name=swipepage_{{pageid}},将页面组件填充到swiper中   
- 设计逻辑图：  
![](https://ws1.sinaimg.cn/large/d586f89bly1g1dp69ma0dj20lu0c5mxz.jpg)  
![](https://ws1.sinaimg.cn/large/d586f89bly1g1dp76krrwj20g708cweo.jpg)  
- tips： 为了提升性能，初始化只渲染默认页，其他页面切换后才渲染，会保存渲染状态，防止重复渲染。并且保证了页面的生命周期是在第一次切换时才触发  
- 主要参数：`pageids:[], changetabbar:func, noswipe:bool, defaultid:string`  
- 参数作用：  
`pageids` ： 使用swiper作为容器，生成相应个数的swiper-item以及slot供页面组件插入  
`changetabbar` ： 当页面切换时会调用此函数通知外部的tabBar切换  
`noswipe` : 页面是否可以通过滑动切换  
`defaultid` : 默认展示的页面id

## 6. Yorbot-dialog : 页面对话框  
主要是一个对话框的容器，包括title、content、button 3个slot  
利用show()、hide()函数控制显隐，默认点击侧壁层会关闭  


## 7. Yorbot-slideBar : 页面侧边栏 
根据内容的大小自适应  
利用show()、hide()函数控制显隐，默认点击侧壁层会关闭  
默认从statusbar开始绘制，可以自己利用wx的API获取statusBar高度来设计占位元素  


## 8. Yrobot-chat-page : 聊天页布局
聊天页面的布局组件  
内部调用页面布局组件，所以使用时外部无需嵌套，直接作为根节点即可  
主要有以下几个slot：navigationBar、messagesHolder、inputArea、popHolder   
- 参数： [Yrobot-content-layout的第一部分参数]、contentBGC  
- 参数作用：  
`contentBGC` : 因为wx获取元素高度不精确的问题暂用的参数，用于和聊天背景融合，设置为背景颜色即可，默认#fff     


## 8. Yrobot-float-menu : 模仿微信长按对话列表弹出的菜单栏
样式参看：  
![](https://ws1.sinaimg.cn/large/d586f89bly1g1f2i2eobvj20bl0khdg3.jpg)  
  
- 类似yrobot-dialog的使用流程，  
- json中添加组件引入，  
- 在wxml中加入Yrobot-float-menu，并设置`id="YrobotFloatMenu"`   
- 在js中，并利用`this.selectComponent("#YrobotFloatMenu").show(event,menulist);`展示floatmenu（event指触摸的事件参数,menulist见下方）   
- 关于长按等事件的实现，建议使用[Yrobot-touch](https://github.com/Yrobot/YrobotTouch-WXLP)  

`menulist`： 配置floatmenu中展示的文字和对应的函数（涉及到this操作记得用bind绑定页面this）  
```
menulist的格式示例：
menulist: [
            {
                text: '标为未读',
                func: function () {
                    console.log('标为未读')
                }.bind(this)
            },
            {
                text: '置顶聊天',
                func: function () {
                    console.log('置顶聊天')
                }.bind(this)
            },
            {
                text: '删除该聊天',
                func: function () {
                    console.log('删除该聊天')
                }.bind(this)
            },
        ],
```


__tips：__  
1. 由于监听的对象一般为容器，所以在page页另外需要逻辑去判断对应的数据对象。一般操作是在page页利用变量储存对象，方便`menulist.func`进行调用。  