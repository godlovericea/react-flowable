import { getSelectName } from '../../apis/process'
class FormTransfer {
    constructor(dataArr){
        console.log(dataArr)
        // 实例化时候传递过来的表单数据对象
        this.dataArr = dataArr
        this.defaultValue = {
            schema: {
                type: 'object',
                properties: {},
            },
            displayType: "column",
            showDescIcon: false,
            column: 3,
            labelWidth: 0
        }
        this.handleResData()
    }
    // 处理数组数据
    handleResData(){
        this.dataArr.forEach((pItem,pIndex) => {
            pItem.Schema.forEach((cItem, cIndex)=>{
                this.handleForm(cItem, pIndex, cIndex)
            })
        })
    }
    // 处理表单数据
    handleForm(formObj, pIndex, cIndex){
        // console.log(formObj)
        if( !formObj)  return;
        if (formObj.Shape.indexOf("文本") > -1) {
            this.ctText(formObj, pIndex, cIndex)
        } else if (formObj.Shape.indexOf("选择器") > -1){
            this.ctSelect(formObj, pIndex, cIndex)
        } else if (formObj.Shape === "日期") {
            this.ctDate(formObj, pIndex, cIndex)
        } else if (formObj.Shape.indexOf("时间") > -1) {
            this.ctDateTime(formObj, pIndex, cIndex)
        }
    }
    // 处理文本类型
    ctText(formObj, pIndex, cIndex){
        const key = `inputName_${pIndex}_${cIndex}`
        this.defaultValue.schema.properties[key] = {
            title: formObj.FieldName,
            type: formObj.Type === '数值' ? 'number' : 'string',
        }
        // console.log(this.defaultValue)
    }
    // 处理下拉选择类型
    ctSelect(formObj, pIndex, cIndex){
        console.log("进来创建选择器")
        let enumval = []
        let enumNames = []
        getSelectName(formObj.FieldName)
        .then((res)=>{
            res.data.forEach((item)=>{
                enumval.push(item.NODEVALUE)
                enumNames.push(item.NODENAME)
            })
            console.log(enumval)
            console.log(enumNames)
            const key = `selectName_${pIndex}_${cIndex}`
            this.defaultValue.schema.properties[key] = {
                title: formObj.FieldName,
                type: 'string',
                enum: enumval,
                enumNames: enumNames,
            }
        })
    }
    // 处理日期类型
    ctDate(formObj, pIndex, cIndex){
        const key = `date_${pIndex}_${cIndex}`
        this.defaultValue.schema.properties[key] = {
            title: formObj.FieldName,
            type: "range",
            format: "date"
        }
    }
    // 处理日期时间
    ctDateTime(formObj, pIndex, cIndex){
        const key = `dateTime${pIndex}_${cIndex}`
        this.defaultValue.schema.properties[key] = {
            title: formObj.FieldName,
            type: "range",
            format: "dateTime"
        }
    }
}

export default FormTransfer