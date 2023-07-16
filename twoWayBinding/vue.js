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

function getValue(obj, keyStr) {
  const keys = keyStr.split('.');
  return keys.reduce((res, key) => res[key], obj);
}

class Vue {
  constructor(options) {
    this.$el = document.querySelector(options.el)
    this.$data = options.data || {};
    this.$methods = options.methods || {};
    this.$watchEvent = {};

    proxy.call(this, this.$data);
    observe.call(this, this.$data)
    this.compile(this.$el);
  }

  // 编译解析
  compile(node) {
    node.childNodes.forEach((item, index) => {
      if (item.nodeType === 3) {
        item.textContent = item.textContent.replace(/\{\{\s*(\S+)\s*\}\}/, (match, vmk) => {
          const value = getValue(this.$data, vmk);
          if (this.hasOwnProperty(vmk) || value!==undefined) {
            const watcher = new Watcher(this, vmk, item, 'textContent');
            if (this.$watchEvent[vmk]) {
              this.$watchEvent[vmk].push(watcher);
            } else {
              this.$watchEvent[vmk] = [];
              this.$watchEvent[vmk].push(watcher);
            }
          }
          return value;
        })
      } else if (item.nodeType === 1) {
        if (item.hasAttribute('@click')) {
          item.addEventListener('click', (event) => {
            const handler = item.getAttribute('@click');
            this.$methods[handler].call(this, event);
          });
        } else if (item.hasAttribute('v-model')) {
          const key = item.getAttribute('v-model');
          item.value = getValue(this.$data, key);

          item.addEventListener('input', (event) => {
            assignment(this.$data, key, event.target.value);
          })
        }

        if (item.childNodes.length) {
          this.compile(item);
        }
      }
    })
  }
}
function proxy(data) {
  Object.keys(data).forEach(key => {
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      get() {
        return this.$data[key];
      },
      set(newValue) {
        assignment(this.$data, key, newValue);
      }
    })
  })
}

function observe(data, lastKey = '') {
  const _this = this;
  Object.keys(data).forEach(key => {
    const fk = lastKey ? lastKey+'.'+key : key;

    let value = data[key];
    if (Object.prototype.toString.call(value) === '[object Object]') {
      observe.call(_this, value, fk);
    } else if (Array.isArray(value)) {
      value.forEach(c => observe.call(_this, c, fk));
    }
    
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
      set(newValue) {
        // assignment(data, key, newValue);
        value = newValue;
        _this.$watchEvent[fk].forEach(item => item.update());
      }
    })
  })
}

class Watcher {
  constructor(vm, key, node, attr) {
    this.vm = vm;
    this.key = key;
    this.node = node;
    this.attr = attr;
  }

  update() {
    const newValue = getValue(this.vm, this.key);
    this.node[this.attr] = newValue;
  }
}
