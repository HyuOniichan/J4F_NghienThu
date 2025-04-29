export const Functions = {
    skibidi() {
        console.log('skibidi')
    },
    updateSpeed(obj, speed = 1) {
        for(let key in obj) {
            obj[key].spd = obj[key].defaultSPD * speed
        }
    },
    findShortestPath(start, end, field) {
        //declare filter for passable place
        const filter = [0]
        //node to find path
        class Node {
            constructor(pos) {
                this.pos = pos
                this.parent = null
            }
        }
        // info
        const row = field.length
        const col = field[0].length
        //passed
        let passed = [`${start[0]}-${start[1]}`]
        //check valid
        const isValid = (x, y) => {
            return x >= 0 && x < row && y >= 0 && y < col && filter.includes(field[x][y]) && !passed.includes(`${x}-${y}`)
        }
        //queue...
        let queueueueueueueueueueueueue = [new Node([...start])]
        while (queueueueueueueueueueueueue.length) {
            let node = queueueueueueueueueueueueue.shift()
            const [x, y] = node.pos
            if (x === end[0] && y === end[1]) {
                //real node 
                class Node {
                    constructor(pos, next) {
                        this.pos = pos
                        this.next = next ? next : null
                    }
                }
                let result = new Node(null)
                while (node) {
                    let head = new Node(node.pos, result)
                    result = head
                    node = node.parent
                }
                return result
            }
            for(let [a, b] of [[x, y + 1], [x, y - 1], [x + 1, y], [x - 1, y]].filter(([a, b]) => isValid(a, b))) {
                passed.push(`${a}-${b}`)
                const obj = new Node([a, b])
                obj.parent = node
                queueueueueueueueueueueueue.push(obj)
            }
        }
        console.log('no path found') //handle no path found ...
        return [];
    }
}