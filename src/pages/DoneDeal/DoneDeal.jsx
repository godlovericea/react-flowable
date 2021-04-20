// 在办
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import FormTransfer from '../../libs/transform/transform'
import ConfigSchemaClass from '../../libs/configSchema/configSchema'
import configData from '../../utils/config'
import { Button, message, Modal, Radio, Input, Table, Space} from 'antd';
import { getTableName, GetFormList, GetTransferList, SaveFormInfoTransfer, TaskSave, 
    GetTaskBaseInfo, getUserName, UpdateTaskInfo, TaskGoBack, WorkflowUrging, GetFlowProcessInfo, 
    WorkflowFileOperation, uploadToService, WorkflowDelete} from '../../apis/process'
import './DoneDeal.less'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
const { Search } = Input;
const { Column } = Table;

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
    // 前一个节点带过来的values值
    const [prevSchemaValues, setPrevSchemaValues] = useState({})
    // 表单类型：台账或者表单
    const [formType, setFormType] = useState("")
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
    // 拉取数据
    const getData =()=>{
        // cookie
        let cookieScope = ""
        // 任务ID
        let taskIdScope = ""
        // 处理cookie
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        let userNameScope = ""
        let userDepartScope = ""
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookieScope = itemArr[1]
                setCookie(cookieScope)
            }
        })
        // 处理任务ID，用户名称，用户所在部门
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("taskId") > -1) {
                taskIdScope = decodeURI(item.split("=")[1])
                setTaskId(taskIdScope)
                window.taskId = taskIdScope
            } else if (item.indexOf("formId") > -1) {
                setFormId(decodeURI(item.split("=")[1]))
            } else if (item.indexOf("userDepart") > -1) {
                userDepartScope = decodeURI(item.split("=")[1])
                setUserDepart(decodeURI(item.split("=")[1]))
            } else if (item.indexOf("userName") > -1) {
                userNameScope = decodeURI(item.split("=")[1])
                setUserName(decodeURI(item.split("=")[1]))
            }
        })
        GetFormList(cookieScope, taskIdScope)
        .then((res)=>{
            console.log(res)
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
                        userDepart: userDepartScope
                    }
                    // 上一个节点带过来的values
                    let values = JSON.parse(fieldData.formId).values
                    const testData = new ConfigSchemaClass(fieldData.ColumnConfig, fieldData.Config, web4Config, values)
                    setSchema(testData.schema)
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
                pathname: '/hisflow',
                state:{
                    taskId: taskId,
                    userName: userName,
                    userDepart:userDepart
                }
            })
        }
    }
    // 获取流程图
    const showModeler=()=>{
        const imgSrc =  document.referrer + configData.baseURL + '/GetWorkflowDiagram?processInstanceId=' + processDefinitionId + '&t=' + (new Date()).getTime()
        setProcessImgSrc(imgSrc)
        setModelerVisible(true)
    }
    // 关闭流程图Modal
    const closeModeler=()=>{
        setModelerVisible(false)
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
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={uploadFile}>附件</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={showTransFlow}>流转信息</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={showModeler}>流程图</Button>
            </div>
            <div className="divider-box"></div>
            <Modal title="流程图" visible={modelerVisible} onCancel={closeModeler} onOk={closeModeler} width={1000}
                bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <img src={processImgSrc} alt="process"/>
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

            <Modal title="附件" visible={fileVisible} onCancel={closeFileVisible} okText="确定" onOk={openUploadVisible} width={680}
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