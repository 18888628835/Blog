class TreeNode {
  key;
  left;
  right;
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}
// 实现一个二叉搜索树
class BinarySearchTree {
  root;
  constructor() {
    this.root = null;
  }
  insertNode(root, key) {
    if (root.key > key) {
      if (root.left === null) {
        root.left = new TreeNode(key);
      } else {
        this.insertNode(root.left, key);
      }
    } else {
      if (root.right === null) {
        root.right = new TreeNode(key);
      } else {
        this.insertNode(root.right, key);
      }
    }
  }
  insert(key) {
    if (this.root === null) {
      this.root = new TreeNode(key);
    } else {
      this.insertNode(this.root, key);
    }
  }
}
let tree = new BinarySearchTree();
tree.insert(7);
tree.insert(15);
tree.insert(5);
tree.insert(6);
tree.insert(3);
tree.insert(9);
tree.insert(8);
tree.insert(10);
tree.insert(13);
console.log(JSON.stringify(tree));
