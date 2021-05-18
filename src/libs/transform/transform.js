import { getSelectName } from '../../apis/process'
class FormTransfer {
    constructor(dataArr){
        // 实例化时候传递过来的表单数据对象
        this.dataArr = dataArr
        // 默认配置一行三列
        this.column = 3
        // 需要导出的schema
        this.schema = {}
    }

    // 处理传递过来的dataArr数组数据
    async handleGroup(){
        let obj = {}
        let key = ""
        for(let i = 0; i< this.dataArr.length; i++) {
            // 对象的key值
            key = `object_${i}`
            // 处理每一种台账的数据类型
            let objData =await this.handleEveryGroup(this.dataArr[i].Schema)
            // 对象的value值
            console.log(objData)
            obj[key] = {
                type:"object",
                title: this.dataArr[i].GroupName,
                properties: objData,
                required: this.judgeRequired(objData)
            }
        }
        this.schema = {
            schema:{
                type: 'object',
                properties: obj
            },
            displayType: "row",
            showDescIcon: false,
            column: this.column,
            labelWidth: 80
        }
        return this.schema
    }
    async handleEveryGroup(schemaList){
        let obj = {}
        let objKey = ""
        for(let i=0;i<schemaList.length;i++) {
            if (!schemaList[i].Visible){
                return
            }
            const shape = schemaList[i].Shape
            const type = schemaList[i].Type
            const name = schemaList[i].FieldName
            const itemObj = schemaList[i]
            const ConfigInfo = schemaList[i].ConfigInfo
            
            if ((shape === "文本" || shape === "编码") && type === "文本") {
                objKey =  `inputName_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleInput(itemObj)
            } else if (shape === "多行文本") {
                objKey =  `textarea_${i}`
                obj[objKey] = await this.handleTextarea(itemObj)
            } else if ((shape + type).indexOf("数值") > -1) {
                objKey = `inputNumber_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleNumberInput(itemObj)
            } else if (shape === "日期") {
                objKey = `date_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleDatePicker(itemObj)
            } else if (shape === "日期时间" || shape === "时间") {
                objKey = `dateTime_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleDateTime(itemObj)
            } else if (shape === "选择器") {
                if (ConfigInfo.indexOf('.') > -1) {
                    objKey = `selectTreeNode_${i}_${ConfigInfo}`
                    obj[objKey] = await this.hanldeSelectTreeNode(name)
                } else {
                    objKey = `selectName_${i}_${itemObj.Alias}`
                    obj[objKey] = await this.hanldeSelect(itemObj)
                }
            } else if (shape === "日期年份") {
                objKey = `selectYear_${i}_${itemObj.Alias}`
                obj[objKey] = await this.hanldeYearSelect(itemObj)
            } else if (shape === "本人姓名") {
                objKey = `mySelfName_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleMySelfName(name)
            } else if (shape === "本人部门") {
                objKey = `mySelfDe_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleMySelfDepart(name)
            } else if (shape.indexOf("人员选择器") > -1) {
                objKey = `staffSelect_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleStaffSelect(itemObj)
            } else if (shape === "附件" || shape==="可预览附件") {
                objKey = `fileUpload_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleFileUploadWidget(itemObj)
            } else if (shape === "值选择器") {
                objKey = `selecValtName_${i}_${itemObj.Alias}`
                obj[objKey] = await this.hanldeValueSelect(itemObj)
            } else if (shape === "搜索选择器") {
                objKey = `selectSearchName_${i}_${itemObj.Alias}`
                obj[objKey] = await this.hanldeSearchSelect(itemObj)
            } else if (shape === "台账选择器") {
                objKey = `accountName_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleTableAccount(itemObj)
            } else if (shape === "可编辑值选择器") {
                objKey = `editble_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleEditBle(itemObj)
            } else if (shape === "坐标控件") {
                objKey = `amap_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleAMap(itemObj)
            } else if (shape === "城市选择器") {
                objKey = `cityPicker_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleCityPicker(itemObj)
            } else {
                objKey = `unrecognized_${i}_${itemObj.Alias}`
                obj[objKey] = await this.handleUnrecognized(itemObj)
            }
        }
        return obj
    }
    // 处理校验规则
    handlePattern(ValidateRule){
        let obj = {}
        // 如果不存在校验规则，直接返回
        if (!ValidateRule) {
            obj.required = false
            return obj
        }
        // 如果只有一条校验规则
        if (ValidateRule.indexOf(',') < 0) {
            if (ValidateRule.indexOf(':') > -1) {
                let maxLengthArr = ValidateRule.split(':')
                if (maxLengthArr[0] === 'maxlength') {
                    obj.minLength = 0
                    obj.maxLength = parseInt(maxLengthArr[1])
                }
            } else if (ValidateRule.indexOf(':') < 0) {
                if (ValidateRule === 'required') {
                    obj.required = true
                } else {
                    obj.required = false
                }
            }
        } else {
            let arr = ValidateRule.split(',')
            arr.forEach((item)=>{
                if (item.indexOf(':') > -1) {
                    let maxLengthArr = item.split(':')
                    if (maxLengthArr[0] === 'maxlength') {
                        obj.minLength = 0
                        obj.maxLength = parseInt(maxLengthArr[1])
                    }
                } else {
                    if (item === "required") {
                        obj.required = true
                    } else {
                        obj.required = false
                    }
                }
            })
        }
        return obj
    }

    // 文本输入框
    handleInput(dataObj){
        const { minLength, maxLength, required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: 'string',
            default: dataObj.PresetValue,
            minLength: minLength || 0,
            maxLength: maxLength || 255,
            pattern: required ?  `^.{${minLength || 0},${maxLength || 255}}$` : "",
            message:{
                pattern: required ? '此项必填': ""
            },
            "ui:options": {
                addonBefore: "",
                addonAfter: dataObj.Unit
            }
        }
    }
    // 多行文本 
    handleTextarea(dataObj){
        const { minLength, maxLength, required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: 'string',
            format: "textarea",
            "ui:width": `${this.column}00%`,
            minLength: minLength || 0,
            maxLength: maxLength || 255,
            pattern: required ?  `^.{${minLength || 0},${maxLength || 255}}$` : "",
            message:{
                pattern: required ? '此项必填': ""
            }
        }
    }
    // 数字输入框
    handleNumberInput(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: "number",
            default: Number(dataObj.PresetValue) || 0,
            pattern: required ?  `^.{0,13}$` : "",
            message: {
                pattern: "请输入数字"
            },
            "ui:options": {
                addonBefore: "",
                addonAfter: dataObj.Unit
            }
        }
    }
    // 日期
    handleDatePicker(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: "string",
            format: "date",
            "ui:options": {
                format: "YY/MM/DD"
            },
            pattern: required ? "^.{1,30}$" : "",
            message: {
                pattern: "请选择日期"
            }
        }
    }
    // 日期时间
    handleDateTime(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: "string",
            format: "dateTime",
            pattern: required ? "^.{1,30}$" : "",
            message: {
                pattern: "请选择日期时间"
            }
        }
    }
    // 日期年份
    hanldeYearSelect(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        let date = new Date()
        const curYear = date.getFullYear()
        const startYear = curYear - 10
        let enumVals = []
        let enumNames = []
        for(let i = curYear ; i > startYear ; i--) {
            enumNames.push(i)
            enumVals.push(i)
        }
        return {
            title:dataObj.Alias,
            type: "string",
            enum: enumVals,
            enumNames: enumNames,
            default: curYear,
            pattern: required ? "^.{1,30}$" : "",
            message: {
                pattern: "请选择年份"
            }
        }
    }
    // 值选择器
    hanldeValueSelect(dataObj){
        if (!dataObj.ConfigInfo) {
            return
        }
        const { required } = this.handlePattern(dataObj.ValidateRule)
        let myOptions = dataObj.ConfigInfo.split(',')
        return {
            title: dataObj.Alias,
            type: "string",
            enum: myOptions,
            enumNames: myOptions,
            default: dataObj.PresetValue,
            pattern: required ? "^.{1,30}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 搜索选择器
    hanldeSearchSelect(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            type: "string",
            "ui:widget": "search",
            "ui:options": {
                value: dataObj.ConfigInfo
            },
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 可编辑值选择器
    handleEditBle(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            type: "string",
            "ui:widget": "editSearch",
            "ui:options": {
                value: dataObj.ConfigInfo
            },
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    //坐标控件
    handleAMap(dataObj) {
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "mapSelect"
        }
    }
    // 城市选择器
    handleCityPicker(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "cityPicker"
        }
    }
    // 本人姓名
    handleMySelfName(title){
        return {
            title,
            type: "string",
            "ui:readonly": true
        }
    }

    // 本人部门
    handleMySelfDepart(title){
        return {
            title,
            type: "string",
            "ui:readonly": true
        }
    }

    // 人员选择器
    handleStaffSelect(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "staff",
            type: "string",
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 附件上传
    handleFileUploadWidget(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "file",
            type: "string",
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 台账选择器
    handleTableAccount(dataObj){
        console.log(dataObj)
        const { required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            type: "string",
            "ui:widget": "table",
            "ui:options": {
                value: dataObj.ConfigInfo
            },
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 判断是否是必填字段
    judgeRequired(objData){
        console.log(objData)
        let requireList = []
        for(let ckey in objData) {
            
            if (objData[ckey].pattern && objData[ckey].pattern !== "") {
                if (objData[ckey].enum && objData[ckey].enum.length === 0) {
                    continue
                }
                requireList.push(ckey)
            }
        }
        return requireList
    }
    // 接口请求异步函数
    async asyncFunc(name){
        let result = await getSelectName(name)
        return result.data
    }
    // 处理下拉
    async hanldeSelect(dataObj){
        const { required } = this.handlePattern(dataObj.ValidateRule)
        let obj = {}
        let data = await this.asyncFunc(dataObj.FieldName);
        let enumVals = []
        let enumNames = []
        data.forEach((item)=>{
            enumVals.push(item.NODEVALUE)
            enumNames.push(item.NODENAME)
        })
        let pattern = ""
        if (required && enumNames.length ===0 && enumVals.length === 0) {
            pattern = ""
        } else {
            if (required) {
                pattern = "^.{1,100}$"
            } else {
                pattern = ""
            }
        }
        obj = {
            title: dataObj.Alias,
            type: 'string',
            enum: enumVals,
            enumNames: enumNames,
            pattern: pattern,
            message: {
                pattern: "必填项"
            }
        }
        return obj
    }

    // 多级联动
    hanldeSelectTreeNode(name){
        return {
            title: name,
            type: "string",
            "ui:widget": "cascader"
        }
    }

    // 未识别对象
    handleUnrecognized(dataObj) {
        const { minLength, maxLength, required } = this.handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: 'string',
            default: dataObj.PresetValue,
            minLength: minLength || 0,
            maxLength: maxLength || 255,
            pattern: required ?  `^.{${minLength || 0},${maxLength || 255}}$` : "",
            message:{
                pattern: required ? '此项必填': ""
            },
            "ui:options": {
                addonBefore: "",
                addonAfter: dataObj.Unit
            }
        }
    }
}

export default FormTransfer