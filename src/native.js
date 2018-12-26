import Messager from "./messager/index"

export default function(webViewContext){
    const {
      bind,
      define,
      listener,
      ready,
      fn,
      on,
      off,
      isConnect
    } = new Messager((data) => {
      console.log("isNative", data)
      data.isNative = 999;
      webViewContext && webViewContext.postMessage && webViewContext.postMessage(data);
    });
  //
  //   let postMessage = webViewContext.postMessage
  //   const descriptor = {
  //   get: function() {
  //     return postMessage;
  //   },
  //   set: function(value) {
  //     postMessage = value;
  //     if(postMessage) {
  //       console.log("can-ready")
  //       setTimeout(ready, 50);
  //     }
  //   }
  // }
  // Object.defineProperty(webViewContext, 'postMessage', descriptor)
  return {
    bind,
    define,
    fn,
    listener,
    on,
    off,
    isConnect
  }
}
