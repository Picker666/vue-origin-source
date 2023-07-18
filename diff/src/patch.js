import vnode from "./vnode";
import createElement from "./createElement";
import patchVnode from "./patchVnode";

function patch(oldVNode, newVNode) {
  if (oldVNode.sel === undefined) {
    // 为真是节点创建虚拟dom节点
    const { tagName, children, innerText } = oldVNode;
    oldVNode = vnode(tagName.toLowerCase(), {}, children, innerText, oldVNode);
  }

  if (oldVNode.sel === newVNode.sel) {
    // 同一个dom
    // if (oldVNode.elm === undefined) {
    //   oldVNode.elm = createElement(oldVNode);
    // }
    patchVnode(newVNode, oldVNode);
  } else {
    // 不是同一个dom
    const oldVNodeElm = oldVNode.elm;
    const newVNodeElm = createElement(newVNode);
    oldVNodeElm.parentNode.insertBefore(newVNodeElm, oldVNodeElm);
    oldVNodeElm.parentNode.removeChild(oldVNodeElm);
  }
}

export default patch;