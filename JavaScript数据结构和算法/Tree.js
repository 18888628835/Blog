//创建一棵树，创建第一个子节点
const createTree = value => {
  const tree = {
    data: value,
    children: null,
    parent: null,
  };
  return tree;
};
//增加节点
const addChildren = (node, value) => {
  let newNode = {
    data: value,
    children: null,
    parent: node,
  };
  node.children = node.children || [];
  node.children.push(newNode);
  return newNode;
};
//遍历节点
const traval = (tree, fn) => {
  fn(tree);
  if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      traval(tree.children[i], fn);
    }
  } else {
    return null;
  }
};
//删除节点
const removeNode = (tree, node) => {
  const siblings = node.parent.children;
  let index = 0;
  for (let i = 1; i < siblings.length; i++) {
    if (siblings[i] === node) {
      index = i;
      break;
    }
  }
  siblings.splice(index, 1);
};
let tree = createTree(10);
let node2 = addChildren(tree, 20);
let node201 = addChildren(node2, 201);
let node3 = addChildren(tree, 30);
let node4 = addChildren(tree, 40);
console.log(tree);
