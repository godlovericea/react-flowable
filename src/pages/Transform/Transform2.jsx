import React, { Component } from 'react'
import { getTableName, getSelectName } from '../../apis/process'
import FormTransfer from '../../libs/transform/transform'
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import './transform.less'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'

export default class Transform extends Component {
    constructor(props){
        super(props)
        this.formRef = React.createRef()
        this.state={
            schema: {},
            formData: {}
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = ()=>{
        const tableName = this.props.location.state.name
        getTableName(tableName)
        .then((res)=>{
            const dataArr = res.data.getMe[0].Groups
            let schemaData = new FormTransfer(dataArr)
            console.log(schemaData)
            console.log(schemaData.schema)
            this.setState({
                schema: JSON.parse(schemaData.schema)
            })           
        })
    }
    asyncFunc = async(name) =>{
        let result = await getSelectName(name)
        return result.data
    }
    hanldeSelect = async(name)=> {
        let obj = {}
        let data = await this.asyncFunc(name);
        let enumVals = []
        let enumNames = []
        data.forEach((item)=>{
            enumVals.push(item.NODEVALUE)
            enumNames.push(item.NODENAME)
        })
        obj = {
            title: name,
            type: 'string',
            enum: enumVals,
            enumNames: enumNames
        }
        return obj
    }
    // 多级联动
    hanldeSelectTreeNode=async(name)=>{
        return {
            title: name,
            "ui:widget": "cascader"
        }
    }
    handleEveryGroup= async(schemaList)=>{
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
                objKey =  `inputName_${i}`
                obj[objKey] = await this.handleInput(itemObj)
            } else if (shape === "多行文本") {
                objKey =  `textarea_${i}`
                obj[objKey] = await this.handleTextarea(name)
            } else if ((shape + type).indexOf("数值") > -1) {
                objKey = `inputNumber_${i}`
                obj[objKey] = await this.handleNumberInput(name)
            } else if (shape === "日期") {
                objKey = `date_${i}`
                obj[objKey] = await this.handleDatePicker(name)
            } else if (shape === "日期时间" || shape === "时间") {
                objKey = `dateTime_${i}`
                obj[objKey] = await this.handleDateTime(name)
            } else if (shape === "选择器") {
                if (ConfigInfo.indexOf('.') > -1) {
                    objKey = `selectTreeNode_${i}_${ConfigInfo}`
                    obj[objKey] = await this.hanldeSelectTreeNode(name)
                } else {
                    objKey = `selectName_${i}`
                    obj[objKey] = await this.hanldeSelect(name)
                }
            } else if (shape === "日期年份") {
                objKey = `selectYear_${i}`
                obj[objKey] = await this.hanldeYearSelect(name)
            } else if (shape === "本人姓名") {
                objKey = `mySelfName_${i}`
                obj[objKey] = await this.handleMySelfName(name)
            } else if (shape === "本人部门") {
                objKey = `mySelfDe_${i}`
                obj[objKey] = await this.handleMySelfDepart(name)
            } else if (shape === "人员选择器") {
                objKey = `staffSelect_${i}`
                obj[objKey] = await this.handleStaffSelect(name)
            } else if (shape === "附件" || shape==="可预览附件") {
                objKey = `file_${i}`
                obj[objKey] = await this.handleFileUploadWidget(name)
            } else if (shape === "值选择器") {
                objKey = `selecValtName_${i}`
                obj[objKey] = await this.hanldeValueSelect(itemObj)
            } else if (shape === "搜索选择器") {
                objKey = `selectSearchName_${i}_${ConfigInfo}`
                obj[objKey] = await this.hanldeSearchSelect(itemObj)
            } else if (shape === "台账选择器") {
                objKey = `accountName_${i}_${ConfigInfo}`
                obj[objKey] = await this.handleTableAccount(itemObj)
            } else if (shape === "可编辑值选择器") {
                objKey = `editble_${i}`
                obj[objKey] = await this.handleEditBle(itemObj)
            }
        }
        return obj
    }
    // 处理校验规则
    handlePattern=(ValidateRule)=>{
        let obj = {}
        // 如果不存在校验规则，直接返回
        if (!ValidateRule) {
            return
        }
        // 如果只有一条校验规则
        if (ValidateRule.indexOf(',') < 0) {
            if (ValidateRule.indexOf(':') > -1) {
                let maxLengthArr = ValidateRule.split(':')
                if (maxLengthArr[0] === 'maxlength') {
                    obj.minLength = null
                    obj.maxLength = parseInt(maxLengthArr[1])
                }
            } else if (ValidateRule.indexOf(':') < 0) {
                if (ValidateRule === 'required') {
                    obj.required = true
                }
            }
        } else {
            let arr = ValidateRule.split(',')
            arr.forEach((item)=>{
                if (item.indexOf(':') > -1) {
                    let maxLengthArr = item.split(':')
                    if (maxLengthArr[0] === 'maxlength') {
                        obj.minLength = null
                        obj.maxLength = parseInt(maxLengthArr[1])
                    }
                } else {
                    if (item === "required") {
                        obj.required = true
                    }
                }
            })
        }
        return obj
    }
    // 文本输入框
    handleInput=(dataObj)=>{
        return {
            title:dataObj.Alias,
            type: 'string',
            default: dataObj.PresetValue,
            minLength: this.handlePattern(dataObj.ValidateRule).minLength,
            maxLength: this.handlePattern(dataObj.ValidateRule).maxLength,
            pattern: this.handlePattern(dataObj.ValidateRule).required ?  `^.{1,100}$` : "",
            message:{
                pattern: '此项必填'
            }
        }
    }
    // 多行文本 
    handleTextarea=(title)=>{
        return {
            title,
            type: 'string',
            format: "textarea",
            "ui:width": "300%"
        }
    }
    // 数字输入框
    handleNumberInput=(title)=>{
        return {
            title,
            type: "string",
            pattern: "^[0-9].*$",
            message: {
                pattern: "请输入数字"
            }
        }
    }
    // 日期
    handleDatePicker=(title)=>{
        return {
            title,
            type: "string",
            format: "date",
            "ui:options": {
              format: "YY/MM/DD"
            }
        }
    }
    // 日期时间
    handleDateTime=(title)=>{
        return {
            title,
            type: "string",
            format: "dateTime",
        }
    }
    // 日期年份
    hanldeYearSelect=(title)=>{
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
            title,
            type: "string",
            enum: enumVals,
            enumNames: enumNames,
            default: curYear
        }
    }
    // 值选择器
    hanldeValueSelect=(dataObj)=>{
        if (!dataObj.ConfigInfo) {
            return
        }
        let myOptions = dataObj.ConfigInfo.split(',')
        return {
            title: dataObj.Alias,
            type: "string",
            enum: myOptions,
            enumNames: myOptions,
            default: dataObj.PresetValue
        }
    }
    // 搜索选择器
    hanldeSearchSelect=(dataObj)=>{
        return {
            title: dataObj.Alias,
            "ui:widget": "search",
        }
    }
    handleEditBle=(dataObj)=>{
        return {
            title: dataObj.Alias,
            "ui:widget": "editSearch",
            "ui:options": {
                value: dataObj.ConfigInfo
            }
        }
    }
    // 本人姓名
    handleMySelfName=(title)=>{
        return {
            title,
            type: "string",
            "ui:readonly": true
        }
    }

    // 本人部门
    handleMySelfDepart=(title)=>{
        return {
            title,
            type: "string",
            "ui:readonly": true
        }
    }

    // 人员选择器
    handleStaffSelect=(title)=>{
        return {
            title,
            "ui:widget": "staff",
        }
    }
    // 附件上传
    handleFileUploadWidget=(title)=>{
        return {
            title,
            "ui:widget": "file",
        }
    }
    // 台账选择器
    handleTableAccount=(dataObj)=>{
        return {
            title: dataObj.Alias,
            "ui:widget": "table",
        }
    }
    // 处理每个分组
    handleGroup= async(dataArr)=>{
        let obj = {}
        let key = ""
        for(let i = 0; i< dataArr.length; i++) {
            key = `object_${i}`
            let objData =await this.handleEveryGroup(dataArr[i].Schema)
            obj[key] = {
                type:"object",
                title: dataArr[i].GroupName,
                properties: objData,
                required:[]
            }
        }
        this.setState({
            schema:{
                schema:{
                    type: 'object',
                    properties: obj,
                    required:[]
                },
                displayType: "row",
                showDescIcon: false,
                column: 3,
                labelWidth: 120
            }
        })
    }
    setFormData=(val)=>{
    }
    handleClickReback=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    render() {
        const {formData} = this.state
        return (
            <div className="transform-wrapper">
                <FormRender
                    ref={this.formRef}
                    {...formData}
                    {...this.state.schema}
                    onChange={this.setFormData}
                    widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file: UploadFile, editSearch: EditbleSelct }}
                />
                <div className="gobackBtn">
                    <Button type="primary" onClick={this.handleClickReback}>
                        返回列表
                    </Button>
                </div>
            </div>
        )
    }
}
