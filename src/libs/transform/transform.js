import { getSelectName } from '../../apis/process'
class FormTransfer {
    constructor(dataArr){
        // 实例化时候传递过来的表单数据对象
        this.dataArr = dataArr
        this.schema = {
            schema: {
                type: 'object',
                properties: {},
            },
            displayType: "row",
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
        
    }
    // 处理文本类型
    ctText(formObj, pIndex, cIndex){
        
    }
    // 处理下拉选择类型
    ctSelect(formObj, pIndex, cIndex){
        
    }
    // 处理日期类型
    ctDate(formObj, pIndex, cIndex){
        
    }
    // 处理日期时间
    ctDateTime(formObj, pIndex, cIndex){
        
    }
}

export default FormTransfer