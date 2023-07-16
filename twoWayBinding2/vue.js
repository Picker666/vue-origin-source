
class Vue {
  constructor(obj_instance) {
    this.$el = document.querySelector(obj_instance.el)
    this.$data = obj_instance.data || {};

    Observer(this.$data);
    Compile(this);
  }
}

function Observer(data_instance) {
  Object.keys(data_instance).forEach((key) => {
    let value = data_instance[key];
    if (!data_instance || typeof data_instance !== 'object') {
      return;
    }
    Observer(value);
    Object.defineProperty(data_instance, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        value = newValue;
        subscribeCenter.notify();
        Observer(newValue);
      }
    })
  })
}

function Compile(vm) {
  const fragment = document.createDocumentFragment();
  let child;
  while (child = vm.$el.firstChild) {
    fragment.append(child);
  }
  fragment_compile(fragment);

  function fragment_compile(node) {
    if (node.nodeType === 3) {
      replaceField(node, vm);
    } else if (node.nodeType === 1) {
      const attr = Array.from(node.attributes);
      attr.forEach(a => {
        if (a.nodeName === 'v-model') {
          node.value = getValue(vm.$data, a.nodeValue);
          new Watcher(vm, a.nodeValue, (newValue) => {
            node.value = newValue
          });

          node.addEventListener('input', (event) => {
            assignment(vm.$data, a.nodeValue, event.target.value)
          })
        }
      })

    }
    node.childNodes.forEach(c => {
      fragment_compile(c);
    })
  }

  vm.$el.appendChild(fragment);
}

function getValue(obj, keyStr) {
  const keys = keyStr.split('.');
  return keys.reduce((res, key) => res[key], obj);
}
function assignment(obj, key, value) {
  const keys = key.split('.');
  const len = keys.length;
  if (len === 1) {
    obj[key] = value;
  } else {
    const tempObj = keys.slice(0, len - 1).reduce((res, k) => res[k], obj);
    tempObj[keys[len - 1]] = value;
  }
}

function replaceField(node, vm) {
  const originNodeValue = node.nodeValue;

  const pattern = /\{\{\s*(\S+)\s*\}\}/;
  const result_regex = pattern.exec(originNodeValue);
  // originNodeValue.match(/\{\{\s*(\S+)\s*\}\}/g);

  if (result_regex) {
    const key = result_regex[1];
    const value = getValue(vm.$data, result_regex[1])
    node.nodeValue = originNodeValue.replace(pattern, value);

    new Watcher(vm, key, (newValue) => {
      node.nodeValue = originNodeValue.replace(pattern, newValue);
    });

    replaceField(node, vm);
  }
}

let subscribeCenter = null;

function createDepInstance() {
  if (!subscribeCenter) {
    subscribeCenter = new SubscribeCenter();
  }
}

// 依赖 - 订阅中心
class SubscribeCenter {
  constructor() {
    this.subscribes = [];
  }

  addSub(sub) {
    this.subscribes.push(sub);
  }

  notify() {
    this.subscribes.forEach(sub => sub.update());
  }
}

// 订阅者
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;

    this.subscribe();
  }

  update() {
    this.value = getValue(vm.$data, this.key);
    this.callback(this.value);
  }

  subscribe() {
    createDepInstance();
    subscribeCenter.addSub(this);
  }
}