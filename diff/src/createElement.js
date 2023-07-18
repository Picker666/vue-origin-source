
export default function createElement(vnode) {
  const { sel, children, text } = vnode;
  const domNode = document.createElement(sel);

  if (Array.isArray(children) && children.length) {
    children.forEach(child => {
      const childNode = createElement(child);
      // child.elm = childNode;
      domNode.appendChild(childNode)
    })
  } else {
    domNode.innerText = text;
  }

  vnode.elm = domNode;

  return domNode;
}