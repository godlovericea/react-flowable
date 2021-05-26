// 处理GetStartForm接口和getFormList接口，返回的内容
import moment from 'moment';
class ConfigSchema {
    // 接收配置文件数组，以及表单配置文件
    constructor(columnConfigList, schemaForm, web4Config, BackFillList, values) {
        // console.log(columnConfigList, "columnConfigList")
        // 配置文件数组：schema所有字段数组
        this.columnConfigList = columnConfigList
        // schema配置文件
        this.schemaForm = schemaForm
        // 本人，本部门等配置数据，从web4传递过来的
        this.web4Config = web4Config
        // 编码生成器字段回填
        this.BackFillList = BackFillList
        // schema表单的数据，formData的值
        this.values = values
        // 要导出的schema值
        this.schema = {}
        this.handleData()
    }
    // 处理数据
    handleData() {
        // 如果values存在，说明不是发起流程，需要解析之前填写的表单FormData数据
        if (this.values) {
            let values = this.values
            // 对象第一层
            for (let key in values) {
                // 对象第二层
                for (let ckey in values[key]) {
                    // 读取字段配置文件数组
                    for (let i = 0; i < this.columnConfigList.length; i++) {
                        if (ckey === this.columnConfigList[i].FieldCode) {
                            // 这里要判断，formdata的值是否是空，如果是空，则不赋值
                            if (values[key][ckey] !== "") {
                                this.columnConfigList[i].Type = values[key][ckey]
                            }
                        }
                    }
                }
            }
        }
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
                        if(item.FieldCode === ckey) {
                            // 处理本人字段
                            if (item.Type === "本人") {
                                item.Type = this.web4Config.userName
                            }
                            // 处理本部门字段
                            if (item.Type === "本部门") {
                                item.Type = this.web4Config.userDepart
                            }
                            // 处理本部门字段
                            if (item.Type === "当前时间") {
                                item.Type = moment().format("YYYY-MM-DD HH:mm:ss")
                            }
                            // 处理所属站点
                            if (item.Type === "所属站点") {
                                item.Type = this.web4Config.site
                            }
                            // 给schema设置 默认值
                            properties[key].properties[ckey].default = item.Type
                            // 给schema设置 单位
                            properties[key].properties[ckey]["ui:options"] = {
                                addonAfter: item.Unit
                            }
                            // 如果是1，则为显示，0不显示
                            if (item.IsShow === "1") {
                                properties[key].properties[ckey]["ui:hidden"] = false
                            } else {
                                properties[key].properties[ckey]["ui:hidden"] = true
                            }

                            // 如果配置了只读
                            if (item.IsRequired === "true") {
                                properties[key].properties[ckey]["ui:readonly"] = true
                            } else {
                                properties[key].properties[ckey]["ui:readonly"] = false
                            }
                        }
                    })
                }
            }

            // 以下逻辑判断schema中，每个object是否都是隐藏状态，如果都是隐藏状态，则让父级也隐藏

            // 初始化对象个数为0
            let hiddenNums = 0
            // 第一层循环
            for (let key in properties) {
                // 初始化数组存放隐藏字段的个数
                let arrSet = []
                // 第二层循环
                for(let ckey in properties[key].properties) {
                    // 每个object的属性的个数
                    hiddenNums = Object.keys(properties[key].properties).length
                    // 存储隐藏的属性的个数
                    if (properties[key].properties[ckey]["ui:hidden"] === true) {
                        // 如果是隐藏状态，则push到数组中
                        arrSet.push(ckey)
                    }
                }
                // 如果隐藏的属性个数和该对象的属性的个数相等，则说明：所有的属性都是隐藏状态，则让其父级object也隐藏
                if (hiddenNums === arrSet.length) {
                    properties[key]["ui:hidden"] = true
                }
            }
        }
        return jsonData
    }
}

export default ConfigSchema