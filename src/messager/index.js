/**
 * Created by rocky on 2018/12/3.
 * @author rockywu<wjl19890427@hotmail.com>
 * 消息公共工厂
 */
import EventEmitter from "./events"

/**
 * Promise对象
 * @constructor
 */
function Deferred() {
  this.promise = new Promise((resolve, reject)=> {
    this.resolve = resolve;
    this.reject = reject;
  });
}

// 计数器
let count = 0;
/**
 * 获取当前计数器
 * @returns {number}
 */
function getId() {
  return count++;
}

/**
 * 初始化消息体
 */
class MsgBody {
  constructor(options) {
    Object.assign(this, {
      data: options.data || void 0, //指令传递的数据
      id: options.id === void 0 ? getId() : options.id, //指令计数器编号
      command: options.command || null, //指令名称
      reply: !!options.reply //是否需要等待回复
    })
  }

  toObject() {
    let rs = {};
    Object.keys(this).forEach(key => {
      rs[key]= this[key];
    });
    return rs;
  }
}

/**
 * 获取事务标记
 * @param model
 */
function getTransactionKey(model) {
  if(model instanceof MsgBody) {
    return model.command + "(" + model.id + ")";
  } else {
    new TypeError("model is not a MsgBody");
  }
}

const SYNC_COMMAND = 'MP&WV:sync';

/**
 * 消息对象,多端同时公用
 */
function Messager(senderHandle) {

  let fn = {}; //对方提供的函数
  let transactions = {}; //事务集
  let callbacks = {}; //回调
  let needWait = []; //需要等待的事务
  let EE = new EventEmitter(); //事件对象



  /**
   * 是否已经单向建立通信
   */
  function isConnect() { }

  /**
   * 绑定B端函数
   */
  function bind(name) {
    return function(...args) {
      return send(name, args)
    }
  }

  /**
   * 定义A端函数
   */
  function define(name, func) {
    callbacks[name] = function (args) { return func.call(void 0, args); };
    needWait && needWait.length == 0  && sync();
    return { define: define, bind: bind };
  }

  /**
   * 发送器
   */
  function sender(model) {
    let force = model.command === SYNC_COMMAND; // force send the message when the message is the sync message
    console.log("sender", force, needWait, model.toObject())
    if (!force && needWait && needWait.push) {
      needWait.push(model);
    } else {
      senderHandle(model.toObject());
    }
    EE.emit("send", model.toObject())
  }

  /**
   * 执行发送
   * @param command
   * @param data
   * @returns {Promise}
   */
  function send(command, data) {
    let body = new MsgBody({
      command: command,
      data: data,
      reply: false
    });

    let defer = new Deferred();
    transactions[getTransactionKey(body)] = defer;
    sender(body);
    return defer.promise;
  }

  /**
   * 尝试等待回复
   * @param data
   * @param result
   */
  function reply(model, result) {
    if( !(model instanceof MsgBody)) {
      new TypeError("model is not a MsgBody");
    }
    model.reply = true;
    model.data = result;
    console.log("reply", model.toObject())
    sender(model);
  }

  /**
   * 监听执行
   * @param data
   */
  function listener(data) {
    let model = new MsgBody(data)
    if (model.reply) {
      let key = getTransactionKey(model);
      transactions[key] && transactions[key].resolve(model.data);
      console.log("run-transactions", key, model.data)
    } else {
      if (callbacks[model.command]) {
        let result = callbacks[model.command](model.data);
        console.log("run-callback", result)
        if (result && result.then) {
          result.then(function (rs) { return reply(model, rs); });
        } else {
          reply(model, result);
        }
      } else {
        reply(model, null);
      }
    }
    /**
     * receive 添加事件
     */
    EE.emit('receive', model.toObject());
  }

  /**
   * 初始化
   */
  function initialize() {
    if (needWait && needWait.length) {
      let waiting = needWait;
      needWait = [];
      waiting.forEach(function (model) {
        sender(model);
      });
      /**
       * ready 添加事件
       */
      EE.emit('ready');
    }
  }

  /**
   * 添加绑定双向同步函数
   */
  let __sync = bind(SYNC_COMMAND);
  /**
   * 自定同步
   * @param defines
   * @returns {Array}
   * @private
   */
  function _sync(defines) {
    console.log("_sync", defines)
    if (defines === void 0) { defines = []; }
    defines.filter((def) => {
      return !(def in fn);
    }).map((key) => {
      console.log("map", key)
      fn[key] = bind(key);
    });
    initialize();
    return Object.keys(callbacks);
  }

  define(SYNC_COMMAND, function(data) {
    console.log("777", data)
    _sync(data[0]);
  });

  /**
   * 执行异步
   */
  function sync() {
    __sync(Object.keys(callbacks)).then(res => {
      console.log("---", res)
      return _sync(res)
    });
  }

  return {
    bind,
    define,
    isConnect,
    listener,
    ready: sync,
    fn,
    on: EE.on, //添加监听
    off: EE.off //添加监听
  }
}

export default Messager;