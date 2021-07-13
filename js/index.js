import '../css/a.css';
import '../css/b.css';
// import '@babel/polyfill';

const add = (x, y) => x + y;
// 下一行不进行eslint所有规则失效（下一行不进行eslint检查）
// eslint-disable-next-line
console.log(add(1, 3));

const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('1');
  }, 100);
});

console.log(promise);
