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
  //中序遍历的辅助函数
  private inOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }
  //中序遍历
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback);
  }
  private preOrderTraverseNode(node, callback) {
    if (node !== null) {
      callback(node.key);
      this.preOrderTraverseNode(node.left, callback);
      this.preOrderTraverseNode(node.right, callback);
    }
  }
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }
  private postOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.postOrderTraverseNode(node.left, callback);
      this.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback);
  }
}
let tree = new BinarySearchTree();
tree.insert(11);
tree.insert(7);
tree.insert(15);
tree.insert(5);
tree.insert(3);
tree.insert(9);
tree.insert(8);
tree.insert(10);
tree.insert(13);
tree.insert(12);
tree.insert(14);
tree.insert(20);
tree.insert(18);
tree.insert(25);
tree.insert(6);
tree.postOrderTraverse(key => {
  console.log(key);
});
