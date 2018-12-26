import invoke from "../../invoke"
const app = getApp();
Page({
  data: {
    pluginData: {},
    webUrl: ""
  },
  goto(e) {
    my.navigateTo({
      url: "/pages/find/home"
    })
  },
  invokeMessage(e) {
    console.log("invokeMessage", e.detail)
    this.handle.listener(e.detail)
  },
  onLoad() {
    this.setData({
      webUrl : "http://localhost:63342/aliMini-webview-invoke/example/webview/invoke.html?_ijt=uts22cjb2or03kuqi04g1s3jjf"
    })
    console.log(777)
    this.webViewContext = my.createWebViewContext('invoke-id');
    let handle = this.handle = invoke(this.webViewContext);
    setTimeout(() => {
      console.error("fn", handle.fn)
    },1000)
    handle.define("WebUseNav", (data) => {
      console.log("WebUseNav", "isNative", data)
      return {
        isNative: true,
      }
    })
    // setInterval(() => {
    //   console.log("running")
    //   let c = handle.bind("NavUseWeb");
    //   console.log(c({aaa : 11}))
    // }, 3000)
  },
})