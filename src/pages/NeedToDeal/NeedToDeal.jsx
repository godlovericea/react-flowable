import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import configData from '../../utils/config'
import { Button, message, Modal, Radio, Input, Table, Space} from 'antd';
import { GetFormList, SaveFormInfo, TaskSave, GetTaskBaseInfo, getUserName, UpdateTaskInfo, TaskGoBack, WorkflowUrging, GetFlowProcessInfo, WorkflowFileOperation, uploadToService} from '../../apis/process'
import './NeedToDeal.less'
import StaffSelect from '../../components/StaffSelect/StaffSelect'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
const { Search } = Input;
const { Column } = Table;

const NeedToDeal = (props) => {
    const [valid, setValid] = useState([])
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
    const [fileDataArr, setFileDataArr] = useState([])
    const [upFileName, setUpFileName] = useState([])

    const formRef = useRef();
    const nameRef = useRef();
    const backRef = useRef();
    const urgentRef = useRef();
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
            }
        })
        GetFormList(cookieScope, taskIdScope)
        .then((res)=>{
            if (res.status === 200) {
                let fieldData = res.data
                let schemaConfig =  JSON.parse(fieldData.Config)
                let fieldConfig = schemaConfig.schema.properties
                let formValObj = JSON.parse(fieldData.formId).values
                for(let skey in fieldConfig){
                    for(let val in formValObj) {
                        if (skey === val) {
                            fieldConfig[skey].default = formValObj[val]
                        }
                    }
                }
                schemaConfig.schema.properties = fieldConfig
                setFormId(JSON.parse(fieldData.formId).formId)
                setSchema(schemaConfig)
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
        const myData = {
            formId:JSON.stringify({
                formId,
                values: formData
            }),
            Config: JSON.stringify(schema)
        }
        TaskSave(cookie, taskId, userId, myData)
        .then((res)=>{
            message.success('保存成功');
        })
    }
    // 完成
    const completeTask=()=>{
        const myData = {
            formId:JSON.stringify({
                formId,
                values: formData
            }),
            Config: JSON.stringify(schema)
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
    const goShowFileOnline=()=>{

    }
    const goDownloadFile=()=>{

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
    // 流程图Modal
    const handleModelerOK=()=>{

    }
    const handleModelerCancel=()=>{

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
                onValidate={setValid}
                widgets={{ staff: StaffSelect, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file: UploadFile, editSearch: EditbleSelct }}
            />
        </div>
    );
};

export default NeedToDeal;