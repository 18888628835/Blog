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
  //插入节点
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
  //先序遍历的辅助函数
  private preOrderTraverseNode(node, callback) {
    if (node !== null) {
      callback(node.key);
      this.preOrderTraverseNode(node.left, callback);
      this.preOrderTraverseNode(node.right, callback);
    }
  }
  // 先序遍历
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }
  //后序遍历的辅助函数
  private postOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.postOrderTraverseNode(node.left, callback);
      this.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }
  //后序遍历
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback);
  }
  minNode(node) {
    let current = node;
    while (current !== null && current.left !== null) {
      current = current.left;
    }
    return current;
  }
  min() {
    return this.minNode(this.root);
  }
  maxNode(node) {
    let current = node;
    while (current && current.right) {
      current = current.right;
    }
    return current;
  }
  max() {
    return this.maxNode(this.root);
  }
  searchNode(node, key) {
    if (node === null) {
      return false;
    }
    if (node.key === key) {
      return true;
    }
    if (key < node.key) {
      return this.searchNode(node.left, key);
    } else if (key > node.key) {
      return this.searchNode(node.right, key);
    }
  }
  search(key) {
    return this.searchNode(this.root, key);
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
console.log(tree.search(26));
