export default function vnode(sel, data, children, text, elm) {
  return {
    children,
    data,
    sel,
    text,
    elm,
    key: data.key,
  }
};