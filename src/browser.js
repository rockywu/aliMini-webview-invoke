import Messager from "./messager/index"
const isBrowser = typeof window !== 'undefined'
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
  console.log("isBrowser", data)
  data.isBrowser = 9999;
  isBrowser && window.my && window.my.postMessage && window.my.postMessage(data);
})
if(isBrowser) {
  let originalPostMessage = window.my
  if(originalPostMessage) {
    console.log("do-ready")
    ready();
    if(!originalPostMessage.onMessage) {
      originalPostMessage.onMessage = (data) => {
        console.log("browser-onMessage", data)
        listener(data);
      }
    }
  } else {
    const descriptor = {
      get: function() {
        return originalPostMessage;
      },
      set: function(value) {
        originalPostMessage = value;
        if(originalPostMessage) {
          console.log("can-ready")
          setTimeout(ready, 50);
          if(!originalPostMessage.onMessage) {
            originalPostMessage.onMessage = (data) => {
              listener(data);
            }
          }
        }
      }
    }
    Object.defineProperty(window, 'my', descriptor)
  }
}


export default {
  bind,
  define,
  fn,
  on,
  off,
  isConnect
}