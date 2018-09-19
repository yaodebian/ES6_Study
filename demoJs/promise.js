//promise练习demo

// //code1:==================================
// function timeout(ms) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, ms, 'done');
//   })
// }

// timeout(1000).then(function(value) {
//   console.log(value);
// })



// //code2:====================================
// new Promise(function(resolve, reject) {
//   console.log('start:');
//   resolve('yaodebian');
// }).then(function(value) {
//   console.log(`end: ${value}`);
// })

// console.log('看看谁先执行');
// //输出结果：
// // start:
// // 看看谁先执行
// // end: yaodebian

// //从上面输出的结果可以看出，new Promise时立即执行"回调参数"(传进去的函数里的动作)，然后按照正常的js调用顺序执行，.then是异步操作，故而在同步操作执行完之后执行。


// //code3:=====================================
// const p1 = new Promise(function(resolve, reject) {
//   setTimeout(function() {
//     resolve('yaodebian')
//   }, 3000)
// })
// const p2 = new Promise(function(resolve, reject) {
//   console.log(111)
//   resolve(p1)
//   console.log('end')
// });
// //输出结果：
// // 111
// // end
// // 三秒后结束程序运行
// //上面这种情况，p2的resolve方法将p1作为参数，即一个异步操作的结果是返回另一个异步操作。
// //这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行。


// //code4:=================================================
// new Promise((resolve, reject) => {
//   resolve(1)
//   console.log(2)
// }).then(r => {
//   console.log(r)
// })
// console.log('yaodebian')
// //输出结果：
// // 2
// // yaodebian
// // 1
// //上面这种情况会先打印出2，然后再接着执行完本轮同步任务，然后再执行resolve，接着才是执行then里面的回调函数。
// //不过上面的resolve后面仍然接着其他的操作是不可取的
// //应该写成这样的形式： return resolve(1) 以防止后序动作的执行，后序动作则放在.then的回调函数中


////code5:Promise.prototype.then=====================================
// new Promise((resolve, reject) => {
//   setTimeout(function() {
//     console.log(1)
//     resolve(1)
//   }, 3000)
// }).then(function(val) {
//   console.log(++val)
//   return val
// }).then(function(val) {
//   console.log(++val)
//   return val
// })


// //code6:===========================
// new Promise((resolve, reject) => {
//   setTimeout(function() {
//     console.log(1)
//     resolve(1)
//   }, 3000)
// }).then(function(val) {
//   console.log(++val)
//   return new Promise((resolve, reject) => {
//     setTimeout(function() {
//       resolve(val)
//     }, 3000)
//   })
// }).then(function(val) {
//   console.log(++val)
//   return val
// })
// //输出结果
// // 1
// // 2
// // 3
// //Promise.prototype.then它返回的也是一个Promise，如果回调函数中仅仅是return一个值val，则相当于重新new了一个Promise对象，并在对象中resolve这个val值，然后返回该新new出来的Promise对象，如果return的是一个Promise对象，则就是返回该Promise对象。


// //code7: =================================================
// new Promise((resolve, reject) => {
//   reject('error')
// })
// .then(function(val) {

// }, function(err) {
//   return('error2')
// })
// .catch(function(error) {
//   console.log(error)
// })
// //.then有两个参数，一个是调用它的Promise实例状态变为resolved时调用，一个是状态变为rejected时调用，值得注意的是两个回调函数调用之后返回的Promise对象，其状态都将是resolved，即fulfilles。
// //Promise.prototype.catch方法相当于Promise.prototype.then(null, function(err){...})，只要catch回调前面有错误抛出，无论相隔多少个.then都能捕获到，前提是该错误在此之前没有被捕获到。


// //code8: ======================================
// // bad
// promise
//   .then(function(data) {
//     // success
//   }, function(err) {
//     // error
//   });

// // good
// promise
//   .then(function(data) { //cb
//     // success
//   })
//   .catch(function(err) {
//     // error
//   });
// //建议使用第二种写法，原因是：第二种写法可以捕获前面then方法执行中的错误，也更接近同步的写法（try/catch）。因此，建议总是使用catch方法，而不使用then方法的第二个参数。