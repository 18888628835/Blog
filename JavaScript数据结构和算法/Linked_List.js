//创建一个节点
let createNode = (value) => {
    return {
        data: value,
        next: null
    }
}
let list = createNode(10) //这是第一个节点，同时让把地址指向list，此时链表就创建完成了
//增加节点
let appendNode = (value, whatList) => {
    let node = createNode(value)
    let x = whatList
    while (x.next != null) {
        x = x.next
    }
    x.next = node
    return node //返回增加的节点
}
let node2 = appendNode(20, list) //返回节点2
let node3 = appendNode(30, list) //返回节点3
let node4 = appendNode(40, list) //返回节点4


//最终实现删除节点的代码
let removeNode = (whichList, rmNode) => {
    let x = whichList
    //此时遇到一个问题，我不知道上一个节点是哪个，那么可以设置变量p，来保存上一个地址
    let p = rmNode
    while (x !== rmNode && x !== null) {
        p = x //通过循环不断保存要删除的节点的上一个地址
        x = x.next //当循环结束时x会保存需要删除的节点的地址
    }
    console.log(p)
    console.log(x)
    if (whichList === null) {
        console.log(`你传进来的${whichList}是空，叫我删个p啊？`)
        return false
    } else if (whichList === rmNode) { //说明要修改的是第一个
        whichList = whichList.next //注意：如果对传进来的复杂类型整体修改，则对原内存无效
        console.log(`修改完毕`); //不信看log打印后的内容
        console.log(whichList) //看我看我，我保存的已经不是传进来的list的地址啦
        return whichList //所以我们必须return出去，然后外部接收才行噢
    } else {
        p.next = x.next //此时修改掉地址指向
    }
}

//遍历链表
let travelList = (whichList, fn) => {
    let x = whichList;
    while (x !== null) {
        fn(x);
        x = x.next
    }
}
travelList(list, function (x) {
    console.log(x.data)
})
console.log(list)