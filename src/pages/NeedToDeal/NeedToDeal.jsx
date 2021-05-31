// 在办
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import FormTransfer from '../../libs/transform/transform'
import FormDataValid from '../../libs/FormDataValid/FormDataValid'
import ConfigSchemaClass from '../../libs/configSchema/configSchema'
import configData from '../../utils/config'
import { Button, message, Modal, Radio, Input, Table, Space} from 'antd';
import { getTableName, GetFormList, GetTransferList, SaveFormInfoTransfer, TaskSave, 
    GetTaskBaseInfo, getUserName, UpdateTaskInfo, TaskGoBack, WorkflowUrging, GetFlowProcessInfo, 
    WorkflowFileOperation, uploadToService, WorkflowDelete, GetAssemblyByTaskID} from '../../apis/process'
import './NeedToDeal.less'
import {ProductInfo} from '../../libs/extraFormMapping/extraFormMapping'
import FormRenderWidgets from '../../libs/FormRenderWidgets/FormRenderWidgets'
const { Search } = Input;
const { Column } = Table;

let actArr = []

const NeedToDeal = (props) => {
    // FormRender提交表单校验
    const [valid, setValid] = useState([])
    // 表单得标识key
    const [FormKey, setFormKey] = useState([])
    // FormRender的formData
    const [formData, setFormData] = useState({});
    // FormRender的schema
    const [schema, setSchema] = useState({})
    // cookie
    const [cookie, setCookie] = useState("")
    // 当前节点的任务ID
    const [taskId, setTaskId] = useState("")
    // 当前节点的流程定义ID
    const [processDefinitionId, setProcessDefinitionId] = useState("")
    // 用户ID
    const [userId, setUserId] = useState("")
    // 表单ID
    const [formId, setFormId] = useState("")
    // 任务移交Modal
    const [visible, setVisible] = useState(false)
    // 会签选择候选人Modal
    const [nextPersonVisible, setNextPersonVisible] = useState(false)
    // 流程图Modal
    const [modelerVisible, setModelerVisible] = useState(false)
    // 回退Modal
    const [rebackVisible, setRebackVisible] = useState(false)
    // 催办Modal
    const [urgentVisible, setUrgentVisible] = useState(false)
    // 候选人
    const [transValue, setTransValue] = useState(null)
    // 候选移交人数组
    const [userNameArr, setUserNameArr] = useState([])
    // 用户名
    const [userName, setUserName] = useState('')
    // 用户所在部门
    const [userDepart, setUserDepart] = useState('')
    // 流程图图片地址
    const [processImgSrc, setProcessImgSrc] = useState(null)

    // 流程详细信息
    // 分配人
    const [Assignee, setAssignee] = useState(null)
    // 截至时间
    const [ETime, setETime] = useState(null)
    // 开始时间
    const [STime, setSTime] = useState(null)
    // 任务名称
    const [TaskName, setTaskName] = useState(null)
    // 流转信息数据表格
    const [tableData, setTableData] = useState([])
    // 回退时候查询节点流转信息
    const [goBacktableData, setGoBacktableData] = useState([])
    // 催办时候，查询节点流转信息
    const [urgentTableData, setUrgentTableData] = useState([])
    // 附件数组
    const [fileTableData, setFileTableData] = useState([])
    // 流转信息Modal
    const [flowVisible, setFlowVisible] = useState(false)
    // 附件Modal
    const [fileVisible, setFileVisible] = useState(false)
    // 上传附件Modal
    const [uploadVisible, setUploadVisible] = useState(false)
    // 流程作废Modal
    const [abolishVisible, setAbolishVisible] = useState(false)
    // 上传附件文件的名字
    const [upFileName, setUpFileName] = useState([])
    // 会签点击完成按钮，选择下一个完成人
    const [nextPerson, setNextPerson] = useState('')
    // 会签时候，点击完成，候选人列表
    const [assigneeList, setAssigneeList] = useState([])
    // 下一个移交人
    const [workCode, setWorkCode] = useState("")
    // 配置schema，传递给下一个节点
    const [configSchema, setConfigSchema] = useState('')
    // 表单类型：台账或者表单
    const [formType, setFormType] = useState("")
    // 
    const [chooseArr, setChooseArr] = useState([])
    // 加载产品信息得白名单数组
    const [isShowProduct, setIsShowProduct] = useState(false)
    
    // FormRender的ref
    const formRef = useRef();
    // 回退的ref
    const backRef = useRef();
    // 催办的ref
    const urgentRef = useRef();

    // FormRender提交表单校验
    const onValidate=(valid)=>{
        setValid(valid)
    }
    // 判断是否要加产品信息组件
    const judgeShowExtraForm=(taskIdArg)=>{
        GetAssemblyByTaskID(taskIdArg)
        .then((res)=>{
            if (res.data.say.statusCode === "0000") {
                if (res.data.getMe.length > 0) {
                    res.data.getMe.forEach((item)=>{
                        if (item.AssemblyName === '产品信息') {
                            setIsShowProduct(true)
                        }
                    })
                }
            } else {
                message.error(res.data.say.errMsg)
            }
        })
    }
    // 子组件传值给父组件
    const getProductInfo=(data)=>{
        // console.log(data, "产品信息")
    }
    const getData =()=>{
        // cookie
        let cookieScope = ""
        // 任务ID
        let taskIdScope = ""
        // 处理cookie
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        let userNameScope = ""
        let siteScope = ""
        let userDepartScope = ""
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookieScope = itemArr[1]
                setCookie(cookieScope)
            }
        })
        // 处理任务ID，用户名称，用户所在部门
        let hashData = ""
        let searchData = ""
        let search = ""
        if (window.location.hash) {
            hashData = window.location.hash
            searchData = hashData.split("?")
            search = searchData[1]
        } else {
            search = window.location.search.slice(1)
        }
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("taskId") > -1) {
                taskIdScope = decodeURI(item.split("=")[1])
                setTaskId(taskIdScope)
                // 根据任务ID去查节点ID，然后是否显示视图
                judgeShowExtraForm(taskIdScope)
                window.taskId = taskIdScope
            } else if (item.indexOf("formId") > -1) {
                setFormId(decodeURI(item.split("=")[1]))
            } else if (item.indexOf("userDepart") > -1) {
                userDepartScope = decodeURI(item.split("=")[1])
                setUserDepart(decodeURI(item.split("=")[1]))
            } else if (item.indexOf("userName") > -1) {
                userNameScope = decodeURI(item.split("=")[1])
                setUserName(decodeURI(item.split("=")[1]))
            } else if (item.indexOf("site") > -1) {
                siteScope = decodeURI(item.split("=")[1])
            }
        })
        GetFormList(cookieScope, taskIdScope)
        .then((res)=>{
            // console.log(res)
            if (res.status === 200) {

                let fieldData = res.data
                setFormType(fieldData.Type)
                if(fieldData.Type === "台账") {
                    // 台账类型
                    const tableName = fieldData.Config
                    getTableName(tableName)
                    .then(async(response)=>{
                        const dataArr = response.data.getMe[0].Groups
                        let formTransfer = new FormTransfer(dataArr)
                        let schemadata =await formTransfer.handleGroup()
                        setSchema(schemadata)
                        setConfigSchema(JSON.stringify(schemadata))
                    })
                } else {
                    // 表单类型
                    setConfigSchema(fieldData.Config)
                    const web4Config = {
                        userName: userNameScope,
                        userDepart: userDepartScope,
                        site: siteScope
                    }
                    // 上一个节点带过来的values
                    
                    let values = JSON.parse(fieldData.formId).values
                    // let values = {}
                    const testData = new ConfigSchemaClass(fieldData.ColumnConfig, fieldData.Config, web4Config, fieldData.BackFillList, values)
                    setSchema(testData.schema)
                    // console.log(fieldData.ColumnConfig, "fieldData.ColumnConfig")

                    // console.log(testData.schema, "testData.schema")
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

        // 处理任务ID，用户ID，用户名称，用户所在部门
        let hashData = ""
        let searchData = ""
        let search = ""
        if (window.location.hash) {
            hashData = window.location.hash
            searchData = hashData.split("?")
            search = searchData[1]
        } else {
            search = window.location.search.slice(1)
        }
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("processInstanceId") > -1) {
                // console.log(item)
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
    // 重置表单
    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
        alert(JSON.stringify(res, null, 2));
        });
    };
    // 返回
    const handleClickReback = ()=>{
        props.history.push({
            pathname: '/form-render/home'
        })
    }
    // 任务移交时候搜索框
    const getTransferName =(value)=>{
        getUserName(value)
        .then((res)=>{
            setUserNameArr(res.data.getMe)
        })
    }

    const handleArray=(arr)=> {
        let str = ""
        if (arr.length === 0){
            str = ""
        } else if (arr.length === 1) {
            str = arr[0] + "#=#"
        } else {
            str = arr.join("#=#")
        }
        return str
    }
    
    // 将字符串转数组
    const revertHandleArray=(params) =>{
        let arr = []
        if (!params){
            arr = []
        } else {
            let arrTemp = params.split("#=#")
            arr = arrTemp.filter(s => {
                return s && s.trim()
            })
        }
        return arr
    }
    // 处理FormRenderBaseType
    const handleFormRenderBaseType = (formData, configSchema)=>{
        let arr = []
        const { properties } = JSON.parse(configSchema).schema
        for (const key in properties) {
            for(const fkey in formData) {
                if (key === fkey) {
                    for(const ckey in properties[key].properties){
                        for(const cfkey in formData[fkey]) {
                            if (ckey === cfkey) {
                                // let tempValue = ""
                                // if (Array.isArray(formData[fkey][cfkey])) {
                                //     tempValue = handleArray(formData[fkey][cfkey])
                                // } else {
                                //     tempValue = formData[fkey][cfkey]
                                // }
                                let tempValue = formData[fkey][cfkey]
                                if (Array.isArray(formData[fkey][cfkey])) {
                                    tempValue = handleArray(formData[fkey][cfkey])
                                }
                                arr.push({
                                    Type: properties[key].properties[ckey].type,
                                    Name: properties[key].properties[ckey].title,
                                    Value: tempValue,
                                    Code: properties[key].properties[ckey].hasOwnProperty("code") && properties[key].properties[ckey].code ? properties[key].properties[ckey].code : ""
                                })
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }
    // 处理参数
    const handleCondition=(formData, configSchema)=> {
        let arr = handleFormRenderBaseType(formData, configSchema)
        let obj = {}
        arr.forEach((item)=>{
            obj[item.Name] = item.Value
        })
        return obj
    }

    // 保存
    const saveTask=()=>{
        // console.log(formData)
        if (valid.length > 0) {
            const validData = new FormDataValid(valid, configSchema)
            message.error(validData.validMsg)
            return
        }
        // let obj = {}
        // if (prevSchemaValues) {
        //     for(let pkey in prevSchemaValues) {
        //         for(let fkey in formData) {
        //             obj[pkey] = prevSchemaValues[pkey]
        //             obj[fkey] = formData[fkey]
        //         }
        //     }
        // }
        const myData = {
            formId:JSON.stringify({
                formId,
                values: formData
            }),
            Config: configSchema,
            FormKey: FormKey,
            FormRenderBaseList: handleFormRenderBaseType(formData, configSchema)
        }

        TaskSave(cookie, taskId, myData)
        .then((res)=>{
            message.success('保存成功');
        })
    }
    // 完成
    // 这里的逻辑：点击完成时候，调取GetTransferList接口查询，下一个节点是否有会签，如果没有，该节点直接完成提交，否则，返回下一个节点的候选人
    const completeTask=()=>{
        if (valid.length > 0) {
            const validData = new FormDataValid(valid, configSchema)
            message.error(validData.validMsg)
            return
        }
        const myData = {
            formId:JSON.stringify({
                formId,
                values: formData
            }),
            formId_Post: formId,
            Config: configSchema,
            FormKey: FormKey,
            FormRenderBaseList: handleFormRenderBaseType(formData, configSchema),
            ConditionInfo: JSON.stringify(handleCondition(formData, configSchema))
        }
        GetTransferList(taskId, userId, cookie, myData)
        .then((res)=>{
            if (res.data.say.statusCode === "0000") {
                if (res.data.getMe.length > 0) {
                    // 打开Modal
                    setNextPersonVisible(true)
                    // 拿去候选人数组
                    // console.log(res.data.getMe)
                    setAssigneeList(res.data.getMe)
                } else {
                    message.success("当前节点已完成")
                    setNextPersonVisible(false)
                }
            } else {
                message.error(res.data.say.errMsg)
            }
        })
    }
    // 选择候选人
    const hanldeAssignChange=(e)=>{
        // console.log(e, "e")
        // console.log(assigneeList, "assigneeList")
        actArr.push({
            ActID: e.target.actid,
            UserID: e.target.value
        })
        actArr.forEach((item)=>{
            if (item.ActID === e.target.actid) {
                item.UserID = e.target.value
            }
        })
        setChooseArr(actArr)
        // setWorkCode(e.target.value)
    }
    // 完成关闭
    const closeNextPersonModeler=()=>{
        setNextPersonVisible(false)
    }

    // 选择候选人之后，完成确定
    const sureNextPersonModeler=()=>{
        let assignArr = []
        assigneeList.forEach((item)=>{
            if (item.PersonInfoList.length > 0) {
                assignArr.push(item)
            }
        })
        if (actArr.length === 0){
            message.error("请选择移交人！")
            return
        }
        var result = [];
        var obj = {};
        for(var i =0; i<chooseArr.length; i++){
            if(!obj[chooseArr[i].ActID]){
                result.push(chooseArr[i]);
                obj[chooseArr[i].ActID] = true;
            }
        }
        if (result.length !== assignArr.length) {
            message.error("请给每个节点选择移交人")
            return
        }
        const myData = {
            formId:JSON.stringify({
                formId,
                values: formData
            }),
            formId_Post: formId,
            Config: configSchema,
            FormKey: FormKey,
            FormRenderBaseList: handleFormRenderBaseType(formData, configSchema),
            TranserSaveModelList: result
        }
        SaveFormInfoTransfer(taskId, userId, cookie, workCode, myData)
        .then(res=>{
            if (res.data.statusCode === "0000") {
                setNextPersonVisible(false)
                message.success("任务移交成功！")
            } else {
                message.error(res.data.errMsg)
            }
        })
    }
    // 搜索移交人
    const onTransferSearch=(e)=>{
        let listArr = []
        var ename = e
        assigneeList.map((item) => {
            let list = {
                ActID: item.ActID,
                PersonInfoList: [],
                PointName: item.PointName
            }
            item.PersonInfoList.map((user) => {
                if (user.UserName.indexOf(ename) > -1 || user.UserID.indexOf(ename) > -1) {
                    list.PersonInfoList.push(user);
                }
            })
            if (list.PersonInfoList.length) {
                listArr.push(list);
            }
        })
        setAssigneeList(listArr)
    }

    // 移交按钮
    const transferTo=()=>{
        getTransferName("")
        setVisible(true)
    }
    // 回退按钮
    const goBack =()=>{
        GetFlowProcessInfo(processDefinitionId)
        .then((res)=>{
            setGoBacktableData(res.data.getMe)
            setRebackVisible(true)
        })
        
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
        GetFlowProcessInfo(processDefinitionId)
        .then((res)=>{
            setUrgentTableData(res.data.getMe)
            setUrgentVisible(true)
        })
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
    // 附件上传
    const openUploadFile = ()=> {
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
    // 获取上传的文件
    const hanldeFileUpload=(e)=>{
        // console.log(e.target.files[0])
        setUpFileName(e.target.files[0])
    }
    // 关闭上传文件的Modal
    const closeFileVisible=()=>{
        setFileVisible(false)
    }
    // 打开查询流转信息
    const showTransFlow=()=>{
        GetFlowProcessInfo(processDefinitionId)
        .then((res)=>{
            setTableData(res.data.getMe)
            setFlowVisible(true)
        })
    }
    // 关闭查询流转信息Modal
    const closeFlow=()=>{
        setFlowVisible(false)
    }
    // 查询流转信息确定
    const sureFlow =()=>{
        setFlowVisible(false)
    }
    // 查看历史节点表单
    const goShowHistoryForm=(taskId)=>{
        return ()=>{
            props.history.push({
                pathname: '/form-render/hisflow',
                state:{
                    taskId: taskId,
                    userName: userName,
                    userDepart: userDepart,
                    FormKey: FormKey
                }
            })
        }
    }
    // 获取流程图
    const showModeler=()=>{
        const imgSrc =  configData.baseURL + '/rest/Services/PandaWorkflow.svc/GetWorkflowDiagram?processInstanceId=' + processDefinitionId + '&t=' + (new Date()).getTime()
        setProcessImgSrc(imgSrc)
        setModelerVisible(true)
    }
    // 关闭流程图Modal
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
    // 关闭移交人Modal
    const handleCancel=()=>{
        setVisible(false)
    }
    // 获取任务移交时候数据
    const handleSetTrans=(e)=>{
        setTransValue(e.target.value)
    }
    // 打开作废弹窗
    const openAbolishModal=()=>{
        setAbolishVisible(true)
    }
    // 取消作废
    const closeAbolishVisible=()=>{
        setAbolishVisible(false)
    }
    // 确定作废
    const sureAbolishVisible=()=>{
        WorkflowDelete(processDefinitionId,cookie)
        .then((res)=>{
            if(res.data.statusCode === "0000") {
                message.success("该流程已作废！")
                setAbolishVisible(false)
            } else {
                message.error(res.data.errMsg)
            }
        })
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
            <div className="divider-box"></div>
            <div className="btnGroups">
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={saveTask}>保存</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={completeTask}>完成</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={transferTo}>移交</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={goBack}>回退</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={openAbolishModal}>作废</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={urgentTask}>催办</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={openUploadFile}>附件</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={showTransFlow}>流转信息</Button>
                <Button type="primary" className="table-oper-btn" style={{ marginRight: 15, width:80 }} onClick={showModeler}>流程图</Button>
            </div>
            <div className="divider-box"></div>
            <Modal title="请选择候选人" visible={nextPersonVisible} onCancel={closeNextPersonModeler} onOk={sureNextPersonModeler} width={650}>
                <div>
                    <Search placeholder="请输入姓名" onSearch={onTransferSearch} enterButton className="cadidateinput"/>
                    {
                        assigneeList.map((item, index)=>{
                            return(
                                <div key={index} className="radio-wrapper">
                                    {
                                        item.PersonInfoList.length > 0 ?
                                            <div className="radio-content">
                                                <div className="radio-title">{item.PointName}</div>
                                                <Radio.Group name="assigngroup" onChange={hanldeAssignChange}>
                                                    {
                                                        item.PersonInfoList.map((cItem,cIndex)=>{
                                                            return(
                                                                <Radio key={cIndex} actid={item.ActID} value={cItem.UserID}>{cItem.UserName}</Radio>
                                                            )
                                                        })
                                                    }
                                                </Radio.Group>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                
            </Modal>
            <Modal title="任务移交" visible={visible} onOk={handleOK} onCancel={handleCancel}
                bodyStyle={{height:'500px',overflowY:'auto'}}>
                <div>
                    <Search
                        className="onlistinput"
                        placeholder="请输入姓名"
                        allowClear
                        style={{width: 400}}
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
            <Modal title="流程图" visible={modelerVisible} onCancel={closeModeler} onOk={closeModeler} width={1000}
                bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <img src={processImgSrc} alt="process"/>
            </Modal>

            <Modal title="回退" visible={rebackVisible} onCancel={closeRebackModeler} onOk={sureRebackModeler} width={750}
                bodyStyle={{ display: 'flex',flexDirection: 'column',justifyContent: 'center'}}>
                    <Table bordered dataSource={goBacktableData} pagination={false} rowClassName="rowClassName" style={{width:'100%'}}>
                        <Column title="操作步骤" dataIndex="TaskName" key="TaskName" align="center"/>
                        <Column title="开始时间" dataIndex="STime" key="STime" align="center"/>
                        <Column title="结束时间" dataIndex="ETime" key="ETime" align="center"/>
                        <Column title="操作人账号" dataIndex="OperationMan" key="OperationMan" align="center"/>
                        <Column
                            title="流程状态"
                            key="state"
                            align="center"
                            render={(text, record) => (
                                <Space size="middle">
                                    {
                                        record.DeleteReason !== "" ?
                                        <span>回退</span>
                                        :
                                        <span style={{color: record.State === '进行中'? '#096dd9' : ''}}>{record.State === "提交" ? "已完成": record.State}</span>
                                    }
                                </Space>
                            )}
                        />
                    </Table>
                    <p className="inputBackReason">请输入回退意见</p>
                    <Input type="text" placeholder="请输入回退意见" ref={backRef}></Input>
            </Modal>

            <Modal title="催办" visible={urgentVisible} onCancel={closeUrgentModeler} onOk={sureUrgentModeler} width={750}
            bodyStyle={{ display: 'flex',justifyContent: 'center',flexDirection: 'column'}}>
                <Table bordered dataSource={urgentTableData} pagination={false} rowClassName="rowClassName" style={{width:'100%'}}>
                        <Column title="操作步骤" dataIndex="TaskName" key="TaskName" align="center"/>
                        <Column title="开始时间" dataIndex="STime" key="STime" align="center"/>
                        <Column title="结束时间" dataIndex="ETime" key="ETime" align="center"/>
                        <Column title="操作人账号" dataIndex="OperationMan" key="OperationMan" align="center"/>
                        <Column
                            title="流程状态"
                            key="state"
                            align="center"
                            render={(text, record) => (
                                <Space size="middle">
                                    {
                                        record.DeleteReason !== "" ?
                                        <span>回退</span>
                                        :
                                        <span style={{color: record.State === '进行中'? '#096dd9' : ''}}>{record.State === "提交" ? "已完成": record.State}</span>
                                    }
                                </Space>
                            )}
                        />
                    </Table>
                    <p className="inputBackReason">请输入催办意见</p>
                    <Input type="text" placeholder="请输入催办意见" ref={urgentRef}></Input>
            </Modal>

            <Modal title="流转信息" visible={flowVisible} onCancel={closeFlow} onOk={sureFlow} width={900}
            bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <Table bordered dataSource={tableData} pagination={false} rowClassName="rowClassName" style={{width:'100%'}}>
                    <Column title="操作步骤" dataIndex="TaskName" key="TaskName" align="center"/>
                    <Column title="开始时间" dataIndex="STime" key="STime" align="center"/>
                    <Column title="结束时间" dataIndex="ETime" key="ETime" align="center"/>
                    <Column title="操作人账号" dataIndex="OperationMan" key="OperationMan" align="center"/>
                    <Column
                        title="流程状态"
                        align="center"
                        key="state"
                        render={(text, record) => (
                            <Space size="middle">
                                {
                                    record.DeleteReason !== "" ?
                                    <span>回退</span>
                                    :
                                    <span style={{color: record.State === '进行中'? '#096dd9' : ''}}>{record.State === "提交" ? "已完成": record.State}</span>
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
                <Table bordered dataSource={fileTableData} pagination={false} rowClassName="rowClassName" style={{width:'100%'}}>
                    <Column title="文件名" dataIndex="name" key="name" align="center"/>
                    <Column title="状态" dataIndex="state" key="state" align="center"/>
                    <Column
                        title="操作"
                        key="action"
                        align="center"
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
            <Modal title="流程作废" visible={abolishVisible} onCancel={closeAbolishVisible} onOk={sureAbolishVisible}
            bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                确定要作废该流程吗？
            </Modal>
            {/* <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, 
                    editSearch: EditbleSelct, mapSelect: AMapContainer,cityPicker: cityPicker, multiSelect: multiSelect, 
                    DateTimePicker:DateTimePicker, CodeGenerator:CodeGenerator }}
            /> */}
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                widgets={FormRenderWidgets}
            />
            {
                isShowProduct ? 
                <div className="product-info-box">
                    <ProductInfo getProductInfo={getProductInfo} showAddProductButton={false} taskId={taskId}></ProductInfo>
                </div>
                :
                null
            }
        </div>
    );
};

export default NeedToDeal;