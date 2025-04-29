/*
this file is to add functions for users
*/
/*common functions helper */
const helperCommonFunctions = {
    debug: m => console.trace(m),
    skibidi: num => console.log('skibidi ',num),
    rand: (from, to) => {return this.floor(Math.random() * (to - from + 1) + from)},
    floor: num => Math.floor(num),
    max: num => Math.max(num),
    min: num => Math.min(num),
    toN: s => (Number)(s),
    toS: a => `${a}`,
    createArrayMultiDimension: (Lengths, fill) => {
        const len = Lengths.shift()
        if(!Lengths.length) return new Array(len).fill(fill)
        return Array.from({length: len}, () => this.createArrayMultiDimension(Lengths, fill))
    },
}
/*local storage function helper */
const helperLocalStorageFunctions = {
    loadData: (dataToLoad) => {
        const datas = localStorage.getItem(dataToLoad)
        if(!datas) {
            console.error(`failed to load ${dataToLoad}`)
            return
        }
        console.log('successfully get data')
        return JSON.parse(datas)
    },
    saveData: (data, location) => {
        if(!(data && location)) return
        const datas = localStorage.getItem(location)
        if(!datas) {
            console.error(`cannot find data with name = ${location}`)
            return
        }
        console.log(data, 'save to' , location)
        localStorage.setItem(location, JSON.stringify(data))
    },
    addData: (storage, dataKey, value, depth) => {
        /*
        storage: the Item in local storage (must be a nest of arrays and ends with objects)
        dataKey: key data to add to storage 
        value: the default value to set for dataKey
        depth: the place that should change in an array
        */
        const thisDatas = JSON.parse(localStorage.getItem(storage)) || null
        if (!(thisDatas && dataKey && value && depth > 0)) return
        function updateInDepth(datas, depth) {
            if (depth === 1) {
                datas[dataKey] = value
                return datas
            } 
            else {
                return datas.map(data => {
                    if (Array.isArray(data)) 
                        return updateInDepth(data, depth - 1)
                    else return undefined
                })
            }
        }
        const updatedData = updateInDepth(thisDatas, depth)
        if(!updatedData) {
            console.error('failed to find location to modify')
            return
        }
        localStorage.setItem(storage, JSON.stringify(updatedData))
    },
}

export {helperCommonFunctions as f}
export {helperLocalStorageFunctions as d}
