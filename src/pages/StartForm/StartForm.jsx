import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import { GetStartForm, WorkflowStart, getTableName, getSelectName } from '../../apis/process'
import "./StartForm.less"
import StaffSelect from '../../components/StaffSelect/StaffSelect'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'

// import schema from '../../json/schema.json';

const StartForm = (props) => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    // const [cookie, setCookie] = useState('')
    const [formId, setFormId] = useState('')
    const [valid, setValid] = useState([])
    const [column, setColumn] = useState(3)
    // const [FlowDefID, setFlowDefID] = useState('')
    // const [name, setName] = useState('')
    // const [userId, setUserId] = useState(null)
    // const [processDefinitionId, setProcessDefinitionId] = useState('')

    const formRef = useRef();

    const asyncFunc = async(name) =>{
        let result = await getSelectName(name)
        return result.data
    }

    const hanldeSelect = async(name)=> {
        let obj = {}
        let data = await asyncFunc(name);
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
    const hanldeSelectTreeNode=async(name)=>{
        return {
            title: name,
            "ui:widget": "cascader"
        }
    }

    const handleEveryGroup= async(schemaList)=>{
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
            const isRequired = false
            
            if ((shape === "文本" || shape === "编码") && type === "文本") {
                objKey =  `inputName_${i}`
                obj[objKey] = await handleInput(itemObj)
            } else if (shape === "多行文本") {
                objKey =  `textarea_${i}`
                obj[objKey] = await handleTextarea(itemObj)
            } else if ((shape + type).indexOf("数值") > -1) {
                objKey = `inputNumber_${i}`
                obj[objKey] = await handleNumberInput(itemObj)
            } else if (shape === "日期") {
                objKey = `date_${i}`
                obj[objKey] = await handleDatePicker(itemObj)
            } else if (shape === "日期时间" || shape === "时间") {
                objKey = `dateTime_${i}`
                obj[objKey] = await handleDateTime(itemObj)
            } else if (shape === "选择器") {
                if (ConfigInfo.indexOf('.') > -1) {
                    objKey = `selectTreeNode_${i}_${ConfigInfo}`
                    obj[objKey] = await hanldeSelectTreeNode(name)
                } else {
                    objKey = `selectName_${i}`
                    obj[objKey] = await hanldeSelect(name)
                }
            } else if (shape === "日期年份") {
                objKey = `selectYear_${i}`
                obj[objKey] = await hanldeYearSelect(itemObj)
            } else if (shape === "本人姓名") {
                objKey = `mySelfName_${i}`
                obj[objKey] = await handleMySelfName(name)
            } else if (shape === "本人部门") {
                objKey = `mySelfDe_${i}`
                obj[objKey] = await handleMySelfDepart(name)
            } else if (shape === "人员选择器") {
                objKey = `staffSelect_${i}`
                obj[objKey] = await handleStaffSelect(itemObj)
            } else if (shape === "附件" || shape==="可预览附件") {
                objKey = `fileUpload_${i}`
                obj[objKey] = await handleFileUploadWidget(name)
            } else if (shape === "值选择器") {
                objKey = `selecValtName_${i}`
                obj[objKey] = await hanldeValueSelect(itemObj)
            } else if (shape === "搜索选择器") {
                objKey = `selectSearchName_${i}_${ConfigInfo}`
                obj[objKey] = await hanldeSearchSelect(itemObj)
            } else if (shape === "台账选择器") {
                objKey = `accountName_${i}_${ConfigInfo}`
                obj[objKey] = await handleTableAccount(itemObj)
            } else if (shape === "可编辑值选择器") {
                objKey = `editble_${i}`
                obj[objKey] = await handleEditBle(itemObj)
            }
        }
        return obj
    }

    // 处理校验规则
    const handlePattern=(ValidateRule)=>{
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
    const handleInput=(dataObj)=>{
        const { minLength, maxLength, required } = handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: 'string',
            default: dataObj.PresetValue,
            minLength: minLength,
            maxLength: maxLength,
            pattern: required ?  `^.{${minLength},${maxLength}}$` : "",
            message:{
                pattern: required ? '此项必填': ""
            }
        }
    }
    // 多行文本 
    const handleTextarea=(dataObj)=>{
        const { minLength, maxLength, required } = handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: 'string',
            format: "textarea",
            "ui:width": `${column}00%`,
            minLength: minLength,
            maxLength: maxLength,
            pattern: required ?  `^.{${minLength},${maxLength}}$` : "",
            message:{
                pattern: required ? '此项必填': ""
            }
        }
    }
    // 数字输入框
    const handleNumberInput=(dataObj)=>{
        const { minLength, maxLength, required } = handlePattern(dataObj.ValidateRule)
        return {
            title:dataObj.Alias,
            type: "string",
            minLength: minLength,
            maxLength: maxLength,
            pattern: required ? "^(\-|\+)?\d+(\.\d+)?$" : "",
            message: {
                pattern: "请输入数字"
            }
        }
    }
    // 日期
    const handleDatePicker=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
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
    const handleDateTime=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
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
    const hanldeYearSelect=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
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
    const hanldeValueSelect=(dataObj)=>{
        if (!dataObj.ConfigInfo) {
            return
        }
        const { required } = handlePattern(dataObj.ValidateRule)
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
    const hanldeSearchSelect=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "search",
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 可编辑值选择器
    const handleEditBle=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
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
    // 本人姓名
    const handleMySelfName=(title)=>{
        return {
            title,
            type: "string",
            "ui:readonly": true
        }
    }

    // 本人部门
    const handleMySelfDepart=(title)=>{
        return {
            title,
            type: "string",
            "ui:readonly": true
        }
    }

    // 人员选择器
    const handleStaffSelect=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "staff",
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 附件上传
    const handleFileUploadWidget=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "file",
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 台账选择器
    const handleTableAccount=(dataObj)=>{
        const { required } = handlePattern(dataObj.ValidateRule)
        return {
            title: dataObj.Alias,
            "ui:widget": "table",
            pattern: required ? "^.{1,100}$" : "",
            message: {
                pattern: "必填项"
            }
        }
    }
    // 判断是否是必填字段
    const judgeRequired=(objData)=>{
        let requireList = []
        for(let ckey in objData) {
            if (objData[ckey].pattern && objData[ckey].pattern !== "") {
                requireList.push(ckey)
            }
        }
        return requireList
    }

    const onValidate=(valid)=>{
        setValid(valid)
    }

    const handleGroup= async(dataArr)=>{
        let obj = {}
        let key = ""
        for(let i = 0; i< dataArr.length; i++) {
            key = `object_${i}`
            let objData =await handleEveryGroup(dataArr[i].Schema)
            obj[key] = {
                type:"object",
                title: dataArr[i].GroupName,
                properties: objData,
                required: judgeRequired(objData)
            }
            
        }
        setSchema({
            schema:{
                type: 'object',
                properties: obj
            },
            displayType: "row",
            showDescIcon: false,
            column: column,
            labelWidth: 120
        })
    }

    const getData =()=>{
        let FlowDefID = props.location.state.FlowDefID
        GetStartForm(FlowDefID)
        .then(res=>{
            if (res.data.Errmsg) {
                alert(res.data.Errmsg)
                return
            }
            setFormId(res.data.FormID)
            if (res.data.Type === "台账") {
                const tableName = res.data.Form
                getTableName(tableName)
                .then((response)=>{
                    const dataArr = response.data.getMe[0].Groups
                    handleGroup(dataArr)
                })
            } else if (res.data.Type === "表单") {
                let resData = `${res.data.Form}`// 这里必须强转字符串，否则无法解析成对象
                let jsonData = JSON.parse(resData)
                setSchema(jsonData)
            }
        })
    }
    useEffect(()=>{
        getData()
    },[])

    const handleSubmit = () => {
        if (valid.length > 0) {
            message.error("提交失败,请按照提示填写表单")
            return
        }
        let processDefinitionId = props.location.state.FlowDefID
        let flowName = props.location.state.flowName
        let userId = props.location.state.userId
        let cookie = ""
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookie = itemArr[1]
            }
        })
        var FormInfo=JSON.stringify({
            formId,
            values: formData
        })
        var date = new Date()
        const myData = {
            FormInfo,
            Config: JSON.stringify(schema),
            processDefinitionId,
            name: `${flowName} - ${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
        }
        WorkflowStart(cookie, userId, myData)
        .then((res)=>{
            message.success("提交成功")
        })
    };

    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
            alert(JSON.stringify(res, null, 2));
        });
    };

    return (
        <div className="startwrap">
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                widgets={{ staff: StaffSelect, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file:UploadFile, editSearch: EditbleSelct }}
            />
            <Button style={{ marginLeft: 30 }} onClick={handleClick}>
                重置
            </Button>
            <Button type="primary" onClick={handleSubmit}>
                提交
            </Button>
        </div>
    );
};

export default StartForm;