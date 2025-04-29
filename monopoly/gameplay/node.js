class Node {
    constructor(value) {
        this.value = value; 
        this.next = null; 
    }
}
class cycleList {
    constructor() {
        this.head = null; 
        this.tail = null; 
    }
    push(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
            newNode.next = this.head
        } else {
            this.tail.next = newNode
            this.tail = newNode
            this.tail.next = this.head
        }
    }
    findNext(value) {
        let temp = this.tail
        do {
            temp = temp.next
            const val = temp.value
            if(val[0] === value[0] && val[1] === value[1]) {
                return temp.next.value
            }
            
        } while(temp.next != this.head)
        return 0
    }
}
export {Node, cycleList}