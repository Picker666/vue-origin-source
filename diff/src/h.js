import vnode from "./vnode";

function h(sel, data, children) {
  if (typeof children === 'string' || typeof children === 'number' || typeof children === 'boolean') {
    return vnode(sel, data, undefined, children, undefined);
  } else if (Array.isArray(children)) {
    return vnode(sel, data, children, undefined, undefined);
  }
};

export default h;