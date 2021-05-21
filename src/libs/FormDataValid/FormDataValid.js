class FormDataValid{
    constructor(valid, configSchema){
        // 未填写的校验数据数组
        this.valid = valid
        // 表单配置schema
        this.configSchema = JSON.parse(configSchema)
        // 校验字段名称
        this.validMsg = this.handleData()
    }

    handleData(){
        let msg = ""
        let valids = []
        const {properties} = this.configSchema.schema
        for(let key in properties) {
            for(let childKey in properties[key].properties) {
                for(let i = 0; i < this.valid.length; i++) {
                    if (this.valid[i] === childKey) {
                        valids.push(properties[key].properties[childKey].title)
                    }
                }
            }
        }
        msg = `表单中：${valids.join(",")}未按要求填写，请检查之后再提交！`
        return msg
    }
}

export default FormDataValid