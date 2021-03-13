import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import configData from '../../utils/config'
import { Button, message, Modal, Radio, Input, Table, Space} from 'antd';
import { getTableName, getSelectName, GetFormList, SaveFormInfo, TaskSave, GetTaskBaseInfo, getUserName, UpdateTaskInfo, TaskGoBack, WorkflowUrging, GetFlowProcessInfo, WorkflowFileOperation, uploadToService} from '../../apis/process'
import './NeedToDeal.less'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
const { Search } = Input;
const { Column } = Table;

const NeedToDeal = (props) => {
    const [valid, setValid] = useState([])
    const [FormKey, setFormKey] = useState([])
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    const [cookie, setCookie] = useState("")
    const [taskId, setTaskId] = useState("")
    const [processDefinitionId, setProcessDefinitionId] = useState("")
    const [userId, setUserId] = useState("")
    const [formId, setFormId] = useState("")
    const [visible, setVisible] = useState(false)
    const [modelerVisible, setModelerVisible] = useState(false)
    const [rebackVisible, setRebackVisible] = useState(false)
    const [urgentVisible, setUrgentVisible] = useState(false)
    const [transValue, setTransValue] = useState(null)
    const [userNameArr, setUserNameArr] = useState([])
    const [userName, setUserName] = useState('')
    const [processImgSrc, setProcessImgSrc] = useState(null)
    // 流程详细信息
    const [Assignee, setAssignee] = useState(null)
    const [ETime, setETime] = useState(null)
    const [STime, setSTime] = useState(null)
    const [TaskName, setTaskName] = useState(null)
    const [tableData, setTableData] = useState([])
    const [fileTableData, setFileTableData] = useState([])
    const [flowVisible, setFlowVisible] = useState(false)
    const [fileVisible, setFileVisible] = useState(false)
    const [uploadVisible, setUploadVisible] = useState(false)
    const [upFileName, setUpFileName] = useState([])
    const [column, setColumn] = useState(3)

    const formRef = useRef();
    const backRef = useRef();
    const urgentRef = useRef();
    const onValidate=(valid)=>{
        setValid(valid)
    }
    const getData =()=>{
        let cookieScope = ""
        let taskIdScope = ""
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookieScope = itemArr[1]
                setCookie(cookieScope)
            }
        })
        // 处理任务ID
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("taskId") > -1) {
                taskIdScope = decodeURI(item.split("=")[1])
                setTaskId(taskIdScope)
                window.taskId = taskIdScope
            } else if (item.indexOf("formId") > -1) {
                setFormId(decodeURI(item.split("=")[1]))
            }
        })
        GetFormList(cookieScope, taskIdScope)
        .then((res)=>{
            if (res.status === 200) {
                let fieldData = res.data
                if(fieldData.Type === "台账") {
                    const tableName = fieldData.Config
                    getTableName(tableName)
                    .then((response)=>{
                        const dataArr = response.data.getMe[0].Groups
                        handleGroup(dataArr)
                    })
                } else {
                    let schemaConfig =  JSON.parse(fieldData.Config)
                    let fieldConfig = schemaConfig.schema.properties
                    if (fieldData.formId) {
                        let formValObj = JSON.parse(fieldData.formId).values
                        for(let skey in fieldConfig){
                            for(let val in formValObj) {
                                if (skey === val) {
                                    let valueObj = formValObj[val]
                                    let childProps = fieldConfig[skey].properties
                                    for(let childKey in fieldConfig[skey].properties) {
                                        for(let childVlue in valueObj) {
                                            if (childKey === childVlue) {
                                                childProps[childKey].default = valueObj[childVlue]
                                            }
                                        }
                                    }
                                    fieldConfig[skey].properties = childProps
                                }
                            }
                        }
                    }
                    schemaConfig.schema.properties = fieldConfig
                    setSchema(schemaConfig)
                }
            }
        })
        GetTaskBaseInfo(taskIdScope)
        .then((response)=>{
            let data = response.data
            setTaskName(data.TaskName)
            setAssignee(data.Assignee)
            setSTime(data.STime)
            setETime(data.ETime)
        })
    }
    // 处理请求参数
    const hanldeRouterParams =()=>{
        // 处理Cookie
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                setCookie(itemArr[1])
            }
        })

        // 处理任务ID
        const search = window.location.search.slice(1)
        console.log(search)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("processInstanceId") > -1) {
                console.log(item)
                setProcessDefinitionId(item.split("=")[1])
            } else if (item.indexOf("userId") > -1) {
                setUserId(item.split("=")[1])
            } else if (item.indexOf("loginName") > -1) {
                setUserName(decodeURI(item.split("=")[1]))
            } else if (item.indexOf("FormKey") > -1) {
                setFormKey(decodeURI(item.split("=")[1]))
            }
        })
    }
    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
        alert(JSON.stringify(res, null, 2));
        });
    };

    const handleClickReback = ()=>{
        props.history.push({
            pathname: '/home'
        })
    }
    const getTransferName =(value)=>{
        getUserName(value)
        .then((res)=>{
            setUserNameArr(res.data.getMe)
        })
    }
    // 保存
    const saveTask=()=>{
        if (valid.length > 0) {
            message.error("提交失败,请按照提示填写表单")
            return
        }
        const myData = {
            formId:JSON.stringify({
                formId,
                values: formData
            }),
            Config: JSON.stringify(schema),
            FormKey: FormKey
        }
        TaskSave(cookie, taskId, userId, myData)
        .then((res)=>{
            message.success('保存成功');
        })
    }
    // 完成
    const completeTask=()=>{
        if (valid.length > 0) {
            message.error("提交失败,请按照提示填写表单")
            return
        }
        const myData = {
            formId:JSON.stringify({
                formId,
                values: formData
            }),
            Config: JSON.stringify(schema),
            FormKey: FormKey
        }
        SaveFormInfo(cookie, taskId, userId, myData)
        .then((res)=>{
            message.success('提交成功');
        })
    }
    // 移交
    const transferTo=()=>{
        getTransferName("")
        setVisible(true)
    }
    // 回退按钮
    const goBack =()=>{
        setRebackVisible(true)
    }
    // 取消回退
    const closeRebackModeler=()=>{
        setRebackVisible(false)
    }
    // 确定回退
    const sureRebackModeler=()=>{
        const textVal = backRef.current.state.value
        TaskGoBack(processDefinitionId,taskId,textVal)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("回退成功！")
                setRebackVisible(false)
            } else {
                message.error(res.data.errMsg)
            }
        })
    }
    //催办
    const urgentTask=()=>{
        setUrgentVisible(true)
    }
    // 取消催办
    const closeUrgentModeler=()=>{
        setUrgentVisible(false)
    }
    // 确定催办
    const sureUrgentModeler=()=>{
        const textVal = urgentRef.current.state.value
        WorkflowUrging(processDefinitionId, userName, textVal)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("催办成功！")
                setUrgentVisible(false)
            } else {
                message.error(res.data.errMsg)
            }
        })
    }
    // 处理单个文件数据
    const handleFileInfo=(pathname)=>{
        var filename = ''
        var pathnameArr = []
        if (!pathname){
            return
        }
        pathnameArr = pathname.split('/')
        filename = pathnameArr[pathnameArr.length - 1]
        return filename
    }
    // 附件
    const uploadFile = ()=> {
        WorkflowFileOperation(taskId)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                let arr = []
                if (res.data.info !== "") {
                    if (res.data.info.indexOf(',') > -1) {
                        var infoArr = res.data.info.split(",")
                        infoArr.forEach(item=>{
                            arr.push({
                                path: document.referrer + 'CityTemp/熊猫智慧水务平台' + item,
                                name: handleFileInfo(item),
                                state: "上传成功"
                            })
                        })
                    } else {
                        arr.push({
                            path:  document.referrer + 'CityTemp/熊猫智慧水务平台' + res.data.info,
                            name: handleFileInfo(res.data.info),
                            state: "上传成功"
                        })
                    }
                    console.log(arr)
                    setFileTableData(arr)
                }
                setFileVisible(true)
            }
        })
    }
    // 打开上传附件窗口
    const openUploadVisible=()=>{
        setFileVisible(false)
        setUploadVisible(true)
    }
    // 关闭附件上传窗口
    const closeUploadVisible=()=>{
        setUploadVisible(false)
    }
    // 确定上传附件
    const sureUploadVisible=()=>{
        var _url = document.referrer + "cityinterface/rest/services/filedownload.svc/uploadfile/workflow/"+ taskId +'/' + upFileName.name;
        var formData = new FormData();
        formData.append("filedata", upFileName);
        var request = new XMLHttpRequest();
        request.open("POST", encodeURI(_url));
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    try {
                        var data = JSON.parse(request.responseText);
                        if (data && data.success) {
                            message.success("数据上传成功");
                            fileuploadToService('workflow', taskId ,upFileName.name)
                        } else {
                            message.error("上传失败")
                        }
                    } catch (e) {
                        message.error("上传失败")
                    }
                } else {
                    message.error("上传失败")
                }
            }
        }
        request.send(formData);
    }
    // 上传文件至服务器
    const fileuploadToService=(folderName, timeStamp, fileName)=> {
        const FilePath = `/${folderName}/${timeStamp}/${fileName}`
        uploadToService(taskId, FilePath)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("上传成功！")
                setUploadVisible(false)
            } else {
                message.error(res.data.errMsg)
            }
        })
    }
    const hanldeFileUpload=(e)=>{
        console.log(e.target.files[0])
        setUpFileName(e.target.files[0])
    }
    const closeFileVisible=()=>{
        setFileVisible(false)
    }
    // 流转信息
    const showTransFlow=()=>{
        GetFlowProcessInfo(processDefinitionId)
        .then((res)=>{
            setTableData(res.data.getMe)
            setFlowVisible(true)
        })
    }
    const closeFlow=()=>{
        setFlowVisible(false)
    }
    const sureFlow =()=>{
        setFlowVisible(false)
    }
    const goShowHistoryForm=(taskId)=>{
        return ()=>{
            props.history.push({
                pathname: '/hisflow',
                state:{
                    taskId: taskId
                }
            })
        }
    }
    // 流程图
    const showModeler=()=>{
        const imgSrc =  document.referrer + configData.baseURL + '/GetWorkflowDiagram?processInstanceId=' + processDefinitionId + '&t=' + (new Date()).getTime()
        setProcessImgSrc(imgSrc)
        setModelerVisible(true)
    }
    const closeModeler=()=>{
        setModelerVisible(false)
    }
    // 移交Modal
    const handleOK=()=>{
        if (!transValue) {
            message.error("请检查移交人！")
            return
        }
        let Condition = JSON.stringify({
            assignee: transValue
        })
        UpdateTaskInfo(Condition, taskId)
        .then((res)=>{
            const parseData = JSON.parse(res.data)
            if (parseData.assignee === transValue) {
                message.success("移交成功")
                setVisible(false)
            } else {
                message.error("移交失败，请检查移交人！")
            }
        })
    }
    const handleCancel=()=>{
        setVisible(false)
    }
    const handleSetTrans=(e)=>{
        setTransValue(e.target.value)
    }
    
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
            
            if ((shape === "文本" || shape === "编码") && type === "文本") {
                objKey =  `inputName_${i}`
                obj[objKey] = await handleInput(itemObj)
                console.log(obj[objKey])
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
            minLength: minLength || 0,
            maxLength: maxLength || 255,
            pattern: required ?  `^.{${minLength || 0},${maxLength || 255}}$` : "",
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
            minLength: minLength || 0,
            maxLength: maxLength || 255,
            pattern: required ?  `^.{${minLength || 0},${maxLength || 255}}$` : "",
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
            minLength: minLength || 0,
            maxLength: maxLength || 13,
            pattern: required ?  `^.{${minLength || 0},${maxLength || 13}}$` : "",
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
            type: 'string',
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
            type: 'string',
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
            type: 'string',
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
            type: 'string',
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
            type: 'string',
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

    useEffect(()=>{
        getData()
        hanldeRouterParams()
    }, [])

    return (
        <div className="needWrap">
            <div className="deal-headerbox">
                <h2 className="dealheaders">{TaskName}</h2>
                <div className="dealdetails">
                    <p className="detail-items">当前处理人：{Assignee}</p>
                    <p className="detail-items">起始时间：{STime}</p>
                    <p className="detail-items">截止时间：{ETime}</p>
                </div>
            </div>
            <div className="btnGroups">
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={saveTask}>保存</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={completeTask}>完成</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={transferTo}>移交</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={goBack}>回退</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={urgentTask}>催办</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={uploadFile}>附件</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={showTransFlow}>流转信息</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={showModeler}>流程图</Button>
            </div>
            <Modal title="任务移交" visible={visible} onOk={handleOK} onCancel={handleCancel}
                bodyStyle={{height:'500px',overflowY:'auto'}}>
                <div>
                    <Search
                        placeholder="请输入姓名"
                        allowClear
                        enterButton="搜索"
                        size="large"
                        onSearch={getTransferName}
                    />
                </div>
                <Radio.Group name="radiogroup" value={transValue} onChange={handleSetTrans}>
                    <div style={{display: 'flex',flexDirection: 'column'}}>
                        {
                            userNameArr.map((item,index)=>{
                                return(
                                    <Radio value={item.JobNum} key={index}>
                                        <div style={{display:"flex", height:'36px',lineHeight:"36px"}}>
                                            <p style={{width:'120px'}}>{item.DepName}</p>
                                            <p>{item.Name}</p>
                                        </div>
                                    </Radio>
                                )
                            })
                        }
                    </div>
                </Radio.Group>
            </Modal>
            <Modal title="流程图" visible={modelerVisible} onCancel={closeModeler} onOk={closeModeler} width={800}
                bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <img src={processImgSrc} alt="process"/>
            </Modal>

            <Modal title="回退" visible={rebackVisible} onCancel={closeRebackModeler} onOk={sureRebackModeler}
                bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <Input type="text" ref={backRef}></Input>   
            </Modal>

            <Modal title="催办" visible={urgentVisible} onCancel={closeUrgentModeler} onOk={sureUrgentModeler}
            bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <Input type="text" ref={urgentRef}></Input>   
            </Modal>

            <Modal title="流转信息" visible={flowVisible} onCancel={closeFlow} onOk={sureFlow} width={900}
            bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <Table dataSource={tableData} pagination={false} rowClassName="rowClassName" style={{width:'100%'}}>
                    <Column title="操作步骤" dataIndex="TaskName" key="TaskName" />
                    <Column title="开始时间" dataIndex="STime" key="STime" />
                    <Column title="结束时间" dataIndex="ETime" key="ETime" />
                    <Column title="操作人账号" dataIndex="OperationMan" key="OperationMan" />
                    <Column
                        title="流程状态"
                        key="state"
                        render={(text, record) => (
                            <Space size="middle">
                                {
                                    record.DeleteReason !== "" ?
                                    <span>回退</span>
                                    :
                                    <span>已完成</span>
                                }
                            </Space>
                        )}
                    />
                    <Column
                        title="操作"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                {
                                    record.DeleteReason !== "" ?
                                    <div>
                                        {record.GoBackReason}
                                    </div>
                                    :
                                    <div>
                                        <Button className="localBtnClass" size="small" type="primary" onClick={goShowHistoryForm(record.TaskID)}>查看</Button>
                                    </div>
                                }
                            </Space>
                        )}
                    />
                </Table>
            </Modal>

            <Modal title="附件" visible={fileVisible} onCancel={closeFileVisible} okText="上传附件" onOk={openUploadVisible} width={680}
            bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <Table dataSource={fileTableData} pagination={false} rowClassName="rowClassName" style={{width:'100%'}}>
                    <Column title="文件名" dataIndex="name" key="name" />
                    <Column title="状态" dataIndex="state" key="state" />
                    <Column
                        title="操作"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                {
                                    <div>
                                        <a href={record.path} download={upFileName.name} style={{marginRight:'10px'}}>下载</a>
                                        <a href={record.path} target="_blank">预览</a>
                                    </div>
                                }
                            </Space>
                        )}
                    />
                </Table>
            </Modal>

            <Modal title="上传附件" visible={uploadVisible} onCancel={closeUploadVisible} onOk={sureUploadVisible}
            bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <Input type="file" onChange={hanldeFileUpload}></Input>
            </Modal>
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file: UploadFile, editSearch: EditbleSelct }}
            />
        </div>
    );
};

export default NeedToDeal;