import createElement from "./createElement";
import updateChildren from "./updateChildren";

export default function patchVnode(newVNode, oldVNode) {
  const oldVNodeElm = oldVNode.elm;
  // 新节点无children
  if (newVNode.children === undefined || newVNode.children.length === 0) {
    oldVNodeElm.innerHtml = '';
    oldVNodeElm.innerText = newVNode.text;
  } else if (oldVNode.children === undefined || oldVNode.children.length === 0) {
    oldVNodeElm.innerText = '';
    newVNode.children.forEach(child => {
      oldVNodeElm.appendChild(createElement(child));
    })
  } else {

    updateChildren(oldVNodeElm, oldVNode.children, newVNode.children);
  }
}