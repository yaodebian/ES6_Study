// 判断变量是否为函数
const isFunction = variable => typeof variable === 'function'

// 定义Promise的三种状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor(handle) {
    if (!isFunction(handle)) {
      throw new Error('MyPromise must accept a function as a parameter')
    }
    // 添加状态
    this._status = PENDING
    // 添加状态值
    this._value = undefined
    // 添加成功回调函数队列
    this._fulfilledQueues = []
    // 添加失败回调函数队列
    this._rejectedQueues = []
    // 执行handle
    try {
      handle(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err)
    }
  }
  // 添加resolve时执行的函数
  _resolve(val) {
    if (this._status !== PENDING) return
    this._status = FULFILLED
    this._value = val
  }
  // 添加reject时执行的函数
  _reject(err) {
    if (this._status !== PENDING) return
    this._status = REJECTED
    this._value = err
  }
  // 添加then方法
  then(onFulfilled, onRejected) {
    const {
      _value,
      _status
    } = this
    switch (_status) {
      // 当状态为pending时，将then方法回调函数假如执行队列等待执行
      case PENDING:
        this._fulfilledQueues.push(onFulfilled)
        this._rejectedQueues.push(onRejected)
        break
        // 当状态已经改变时，立即执行对应的回调函数
      case FULFILLED:
        onFulfilled(_value)
        break
      case REJECTED:
        onRejected(_value)
        break
    }
    // 返回一个新的Promise对象
    return new MyPromise((onFulfilledNext, onRejectedNext) => {})
  }
  
}