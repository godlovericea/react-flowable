class FieldToArray{
    constructor(arr){
        this.arr = arr
        this.list = []
        this.handleArray()
    }
    handleArray() {
        let resArr = []
        this.arr.forEach((item)=>{
            let obj = {
                ID: item.ID
            }
            item.WebRow.forEach((cItem)=>{
                let key = cItem.FieldName
                let value = cItem.FieldValue
                obj[key] = value
            }) 
            resArr.push(obj)
        })
        return resArr
    }
}

export default FieldToArray