import h from './h.js';
import patch from './patch.js';

const  vnode1 = h('h1', {}, 'Picker2222');
const vnode2 = h('ul', {}, [
  h('li', {}, 'a'),
  h('li', {}, 'b'),
  h('li', {}, 'c'),
]);

// console.log('vnode2: ', vnode2);
// console.log('vnode1: ', vnode1);

// 元素不同的节点
const container = document.getElementById('container');
// patch(container, vnode1);

// ===========元素相同的节点
const vnode3 = h('div', {}, 'Christine...');
const vnode4 = h('div', {}, [vnode2]);
// patch(container, vnode4);


const vnode5 = h('ul', {}, [
  // h('li', {key: 'a'}, 'a'),
  h('li', {key: 'b'}, 'b'),
  h('li', { key: 'c' }, 'c'),
  h('li', {key: 'd'}, 'd'),
  h('li', {key: 'e'}, 'e'),
]);
patch(container, vnode5);

const vnode6 = h('ul', {}, [
  h('li', {key: 'c'}, 'c'),
  h('li', {key: 'b'}, 'b'),
  h('li', { key: 'e' }, 'e'),
  h('li', {key: 'a'}, 'a'),
  h('li', {key: 'd'}, 'd'),
  h('li', {key: 'f'}, 'f'),
]);

const btn = document.getElementById('btn');
btn.onclick = function () {
  patch(vnode5, vnode6);
}
