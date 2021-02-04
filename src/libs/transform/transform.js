class FormTransfer {
    constructor(dataArr){
        // 实例化时候传递过来的表单数据对象
        this.dataArr = dataArr
        this.defaultValue = {
            schema: {
                type: 'object',
                properties: {},
            },
            displayType: 'column',
            showDescIcon: false,
            column: 1
        }
        this.handleResData()
    }
    // 处理数组数据
    handleResData(){
        this.dataArr.forEach((pItem,pIndex) => {
            pItem.forEach((cItem, cIndex)=>{
                this.handleForm(cItem, pIndex, cIndex)
            })
        })
    }
    // 处理表单数据
    handleForm(formObj, pIndex, cIndex){
        if( !formObj)  return;
        if (formObj.Shape.indexOf("文本") > 0) {
            this.ctText(formObj, pIndex, cIndex)
        } else if (formObj.Shape.indexOf("选择器") > 0){
            this.ctSelect(formObj, pIndex, cIndex)
        } else if (formObj.Shape === "日期") {
            this.ctDate(formObj, pIndex, cIndex)
        } else if (formObj.Shape.indexOf("时间") > 0) {
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
        console.log(this.defaultValue)
    }
    // 处理下拉选择类型
    ctSelect(){

    }
    // 处理日期类型
    ctDate(){

    }
    // 处理日期时间
    ctDateTime(){

    }
}

export default FormTransfer