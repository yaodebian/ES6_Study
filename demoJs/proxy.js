//proxy应用

// //code1:=================================
// var obj = new Proxy({}, {
//   get: function(target, key, receiver) {
//     console.log(`getting ${key}`);
//     return Reflect.get(target, key, receiver);
//   },
//   set: function(target, key, value, receiver) {
//     console.log(`setting ${key}`);
//     return Reflect.set(target, key, value, receiver);
//   }
// })
// //对一个空对象架设了一层拦截，实际上重载(overload)点运算符，用自己的定义覆盖了对象原始定义。

// module.exports = function() {
//   obj.count = 1;//setting count
//   ++obj.count;//getting count
//               //setting count
// };


// //code2:==============================
// var proxy = new Proxy({}, {
//   get: function(target, property) {
//     return 35;
//   }
// });

// module.exports = function() {
//   console.log(proxy.a);//35
//   console.log(proxy.b);//35
//   console.log(proxy.c);//35
// }
////注意：要使得Proxy起作用，必须针对Proxy实例(上例是proxy对象)进行操作，而不是针对目标对象(上例空对象)进行操作。


// //code3:handler没有设置任何拦截，等同于直接通向原对象，其调用原对象的默认配置。无论设置拦截，原对象值只会按照调用自身函数的方式改变自己，而proxy则按照自己的拦截配置进行操作，相当于依次proxy操作会影响两个对象，但两个对象却又互不纷扰，如果有拦截配置，proxy会优先使用拦截配置，没有则使用默认配置。==================================
// var target1 = {};
// var target2 = {}
// var handler1 = {};
// var handler2 = {
//   get: function (target, property) {
//     return 35;
//   }
// }
// var proxy1 = new Proxy(target1, handler1);
// var proxy2 = new Proxy(target2, handler2);
// module.exports = function () {
//   proxy1.a = 'b';
//   console.log(target1.a);
//   console.log(proxy1.a);

//   proxy2.a = 'b';
//   console.log(target2.a);
//   console.log(proxy2.a);
// }


// //code4:==============================================
// var proxy = new Proxy({}, {
//   get: function(target, property) {
//     return 35;
//   }
// });

// module.exports = function() {
//   //通过Object.create()接口创建一个以proxy为原型的对象
//   let obj = Object.create(proxy);
//   //obj中由于没有time属性，根据原型链会在proxy对象中读取该属性，导致被拦截。
//   console.log(obj.time); // 35
// }


// //code5:同一拦截器设置多个拦截操作=====================================
// var handler = {
//   get: function(target, name) {
//     if(name === 'prototype') {
//       return Object.prototype;
//     }
//     return 'Hello,' + name;
//   },

//   apply: function(target, thisBinding, args) {
//     return args[0];
//   },

//   construct: function(target, args) {
//     return {value: args[1]};
//   }
// };

// var fproxy = new Proxy(function(x, y) {
//   return x + y;
// }, handler);

// module.exports = function() {
//   console.log(fproxy(1, 2));//1
//   console.log(new fproxy(1, 2));//{value, 2}
//   console.log(fproxy.prototype === Object.prototype);//true
//   console.log(fproxy.foo === "Hello, foo"); //true
// }


//拦截方法：==================================================

//get方法：============================================
// //code6:=============================================
// var person = {
//   name: "张三"
// };

// var proxy = new Proxy(person, {
//   get: function(target, property) {
//     if (property in target) {
//       return target[property];
//     } else {
//       throw new ReferenceError("Property \"" + property + "\" does not exist.");
//     }
//   }
// })
// //上面代码表示，如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截函数，访问不存在的属性，只会返回undefined。

// module.exports = function() {
//   console.log(proxy.name);
//   console.log(proxy.age);
// }



// //code7:使用get拦截，实现数组读取负数的索引
// function createArray(...elements) {
//   let handler = {
//     get(target, propKey, receiver) {
//       let index = Number(propKey);
//       if(index < 0) {
//         propKey = String(target.length + index);
//       }
//       return Reflect.get(target, propKey, receiver);
//     }
//   };

//   let target = [];
//   target.push(...elements);
//   return new Proxy(target, handler);
// }

// module.exports = function() {
//   let temp = ['a', 'b', 'c'];
//   let arr = createArray(...temp);
//   console.log(arr[-1]);//c
// }