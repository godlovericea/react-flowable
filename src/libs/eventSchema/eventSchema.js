// 处理GetStartForm接口和getFormList接口，返回的内容
class EventSchema {
    // 接收配置文件数组，以及表单配置文件
    constructor(schemaForm, columnConfigList) {
        // schema配置文件
        this.schemaForm = schemaForm
        console.log(schemaForm)
        // schema表单的数据，formData的值
        this.columnConfigList = columnConfigList
        // 要导出的schema值
        this.schema = {}
        this.handleData()
    }
    // 处理数据
    handleData() {
        // 接受数据，并导出
        this.schema = this.handleSchema()
    }
    // 处理表单数据
    handleSchema() {    
        // let resData = `${schemaForm}` // 这里必须强转字符串，否则无法解析成对象
        let jsonData = JSON.parse(this.schemaForm)
        if (this.columnConfigList && this.columnConfigList.length > 0) {
            // 解析拿到schema的第一层properties
            let properties = jsonData.schema.properties
            for(let key in properties) {
                // 第二层properties
                for(let ckey in properties[key].properties) {
                    // 遍历配置文件
                    this.columnConfigList.forEach((item)=>{
                        console.log(item, ckey)
                        if(item.Name === properties[key].properties[ckey].title) {
                            // 给schema设置 默认值
                            properties[key].properties[ckey].default = item.Value
                        }
                    })
                }
            }
        }
        return jsonData
    }
}

export default EventSchema