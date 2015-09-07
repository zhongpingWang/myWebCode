'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

define(function (require, exports, moudles) {

  var array = [1, 2, 3];
  //ES6
  array.forEach(function (v) {
    return console.log(v);
  });

  var TaskCenter = {};

  TaskCenter.show = function () {

    alert(123);
  };

  //通过对象字面量创建对象
  var human = {
    breathe: function breathe() {
      console.log('breathing...');
    }
  };
  var worker = {
    __proto__: human, //设置此对象的原型为human,相当于继承human
    company: 'freelancer',
    work: function work() {
      console.log('working...');
    }
  };
  human.breathe(); //输出 ‘breathing...’
  //调用继承来的breathe方法
  worker.breathe(); //输出 ‘breathing...’

  //产生一个随机数
  var num = Math.random();
  //将这个数字输出到console
  console.log('your num is ' + num + '  and ' + num);

  var _getVal = getVal();

  var _getVal2 = _slicedToArray(_getVal, 2);

  var x = _getVal2[0];
  var y = _getVal2[1];var _ref = ['wayou', 'male', 'secrect'];
  var name = _ref[0];
  var age = _ref[2];
  //数组解构

  function getVal() {
    return [1, 2];
  }

  console.log('x:' + x + ', y:' + y); //输出：x:1, y:2
  console.log('name:' + name + ', age:' + age); //输出： name:wayou, age:secrect

  function sayHello(name) {
    //传统的指定默认参数的方式
    var name = name || 'dude';
    console.log('Hello ' + name);
  }
  //运用ES6的默认参数
  function sayHello2() {
    var name = arguments.length <= 0 || arguments[0] === undefined ? 'dude' : arguments[0];

    console.log('Hello ' + name);
  }
  sayHello(); //输出：Hello dude
  sayHello('Wayou'); //输出：Hello Wayou
  sayHello2(); //输出：Hello dude
  sayHello2('Wayou'); //输出：Hello Wayou

  //将所有参数相加的函数
  function add() {
    for (var _len = arguments.length, x = Array(_len), _key = 0; _key < _len; _key++) {
      x[_key] = arguments[_key];
    }

    return x.reduce(function (m, n) {
      return m + n;
    });
  }
  //传递任意个数的参数
  console.log(add(1, 2, 3)); //输出：6
  console.log(add(1, 2, 3, 4, 5)); //输出：15

  var people = ['Wayou', 'John', 'Sherlock'];
  //sayHello函数本来接收三个单独的参数人妖，人二和人三
  function sayHello(people1, people2, people3) {
    console.log('Hello ' + people1 + ',' + people2 + ',' + people3);
  }
  //但是我们将一个数组以拓展参数的形式传递，它能很好地映射到每个单独的参数
  sayHello.apply(undefined, people); //输出：Hello Wayou,John,Sherlock

  //而在以前，如果需要传递数组当参数，我们需要使用函数的apply方法
  sayHello.apply(null, people); //输出：Hello Wayou,John,Sherlock

  for (var _i = 0; _i < 2; _i++) {
    console.log(_i); //输出: 0,1
  }

  console.log(i); //输出：undefined,严格模式下会报错

  var someArray = ["a", "b", "c"];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = someArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      v = _step.value;

      console.log(v); //输出 a,b,c
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var a = "";
});
//函数返回值的解构