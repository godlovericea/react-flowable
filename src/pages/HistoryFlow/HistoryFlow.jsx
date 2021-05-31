// 在办
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import FormTransfer from '../../libs/transform/transform'
import ConfigSchemaClass from '../../libs/configSchema/configSchema'
import { Button, message} from 'antd';
import { getTableName, GetFormList, GetTaskBaseInfo, GetAssemblyByTaskID} from '../../apis/process'
import './HistoryFlow.less'
import ProductInfo from '../../components/ProductInfo/ProductInfo'
import FormRenderWidgets from '../../libs/FormRenderWidgets/FormRenderWidgets'

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
    // 拉取数据
    const getData =()=>{
        const FormKey = props.location.state.FormKey
        
        // cookie
        let cookieScope = ""
        // 任务ID
        let taskIdScope = props.location.state.taskId
        judgeShowExtraForm(taskIdScope)
        setTaskId(taskIdScope)
        // 处理cookie
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookieScope = itemArr[1]
                setCookie(cookieScope)
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
                        userName: props.location.state.userName,
                        userDepart: props.location.state.userDepart
                    }
                    // 上一个节点带过来的values
                    let values = JSON.parse(fieldData.formId).values
                    const testData = new ConfigSchemaClass(fieldData.ColumnConfig, fieldData.Config, web4Config, fieldData.BackFillList, values)
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
    const goBack=()=>{
        props.history.go(-1)
    }
    useEffect(()=>{
        getData()
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
            {/* <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, 
                    editSearch: EditbleSelct, mapSelect: AMapContainer,cityPicker: cityPicker,multiSelect: multiSelect, 
                    DateTimePicker:DateTimePicker,CodeGenerator:CodeGenerator }}
            /> */}
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
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
            <div className="btngroups">
                <Button type="primary" onClick={goBack}>返回</Button>
            </div>
        </div>
    );
};

export default NeedToDeal;