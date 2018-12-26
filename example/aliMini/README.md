## 概述

本示例演示如何开发一个通用插件。

* app.js - 演示如何获取从主体小程序传递过来的参数
* plugin.json - 插件期望从主体小程序中获得哪些参数
* plugin-mock.json - 指定调试插件的容器appid，另外可指定在模拟器中直接传递的参数 


## 使用
* 真机调试时，唤起容器，插件接受到的参数是容器传递过来的，plugin-mock.json里面的参数在模拟器中起作用，也会在真机预览时传递到容器

## 资源
1. 第三方应用和插件相关文档，[可以在这里找到](https://docs.alipay.com/mini/isv)
2. 真机预览需要扫码登录并选中关联应用，[请点击这里查看详情](https://docs.alipay.com/mini/ide/overview) 
3. 如果您对框架还不太熟悉，[请参考帮助文档](https://docs.alipay.com/mini/framework/overview)
