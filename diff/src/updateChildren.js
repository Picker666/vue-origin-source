import patchVnode from './patchVnode';
import createElement from './createElement';

function sameVNode(oldNode, newNode) {
  const isSame = oldNode.key === newNode.key;

  if (isSame) {
    patchVnode(newNode, oldNode);

    // if (newNode) {
    //   newNode.elm = oldNode.elm;
    // }
  };
  return isSame;
}

export default function (parentElm, oldVCh, newVCh) {
  console.log('parentElm, oldVCh, newCh: ', parentElm, oldVCh, newVCh);

  let oldStartIdx = 0;
  let oldEndIdx = oldVCh.length - 1;
  let newStartIdx = 0;
  let newEndIdx = newVCh.length - 1;
  let oldStartVnode, oldEndVnode, newStartVnode, newEndVnode;

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    oldStartVnode = oldVCh[oldStartIdx];
    oldEndVnode = oldVCh[oldEndIdx];
    newStartVnode = newVCh[newStartIdx];
    newEndVnode = newVCh[newEndIdx];

    if (oldStartVnode === undefined) {
      oldStartIdx++;
    } else if (oldEndVnode === undefined) {
      oldEndIdx--;
    } else if (sameVNode(oldStartVnode, newStartVnode)) {
      console.log(1);
      oldStartIdx++;
      newStartIdx++;
    } else if (sameVNode(oldEndVnode, newEndVnode)) {
      console.log(2);
      oldEndIdx--;
      newEndIdx--;
    } else if (sameVNode(oldStartVnode, newEndVnode)) {
      console.log(3);
      oldStartIdx++;
      newEndIdx--;

      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
    } else if (sameVNode(oldEndVnode, newStartVnode)) {
      console.log(4);
      oldEndIdx--;
      newStartIdx++;
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
    } else {
      console.log(5);
      const { key } = newStartVnode;

      const index = oldVCh.findIndex(item => item?.key === key);
      if (index >= 0) {
        const current = oldVCh[index];
        patchVnode(newStartVnode, current);

        oldVCh[index] = undefined;
        parentElm.insertBefore(current.elm, oldStartVnode.elm);
      // } else {
      //   parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      }

      newStartIdx++;
    }

    if (oldStartIdx > oldEndIdx) {
      const temp = newVCh[newEndIdx + 1] ? newVCh[newEndIdx + 1].elm : null;
      for (let i = oldStartIdx; i <= newEndIdx; i++) {
        parentElm.insertBefore(createElement(newVCh[i]), temp);
      }
    } else if (newStartIdx > newEndIdx) {
      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        parentElm.removeChild(oldVCh[i].elm);
      }
    }
  }
  
  console.log('parentElm: ', parentElm);
  
}