import request from '../utils/request'

// 流程列表
export function GetWorkflowBaseInfo (WorkflowName, userName, STime, ETime, pageIndex, pageSize) {
    return request({
        url: '/GetWorkflowBaseInfo?WorkflowName=' + WorkflowName +`&UserName=${userName}` + `&STime=` + STime + `&ETime=` + ETime + `&pageIndex=` + pageIndex + `&pageSize=` + pageSize + `&sortFields=created&direction=desc`,
        method: 'get'
    })
}

// 删除流程
export function UpdateStatus (id, type) {
    return request({
        url: `/UpdateStatus?id=${id}&type${type}`,
        method: 'get'
    })
}

// 登录到flowable
export function flowableLogin (data) {
    return request({
        url: `/Flowable_Login`,
        method: 'post',
        data
    })
}

// 新增流程
export function CreateModel (cookie, data) {
    return request({
        url: `/CreateModel?Cookie=${cookie}`,
        method: 'post',
        data
    })
}

// 查询表单列表
export function GetFormListInfo (FormName, pageIndex, pageSize) {
    return request({
        url: `/GetFormListInfo?FormName=${FormName}&pageIndex=${pageIndex}&pageSize=${pageSize}&sortFields=created&direction=desc`,
        method: 'get'
    })
}

// 查询表单列表
export function GetFormJson (id) {
    return request({
        url: `/GetFormJson?FormID=${id}`,
        method: 'get'
    })
}

// 删除表单
export function DeleteFormLogic (name, id) {
    return request({
        url: `/DeleteFormLogic?UserName=${name}&FormID=${id}`,
        method: 'get'
    })
}

// 编辑表单
export function UpdateFormDef (id, data) {
    return request({
        url: `/UpdateFormDef?FormID=${id}`,
        method: 'post',
        data
    })
}

// 任务发起检查移交人
export function GetTransferList_FirstNode (cookie, userId, EventNode, data) {
    return request({
        url: `/GetTransferList_FirstNode?Cookie=${cookie}&UserID=${userId}&EventNode=${EventNode}`,
        method: 'post',
        data
    })
}

// 任务发起
export function WorkflowStart (cookie, userId, EVENTCODE, USERCODE, data) {
    return request({
        url: `/WorkflowStart?Cookie=${cookie}&UserID=${userId}&EventCode=${EVENTCODE}&UserCode=${USERCODE}`,
        method: 'post',
        data
    })
}

// 查询表单
export function GetStartForm (FlowDefID) {
    return request({
        url: `/GetStartForm?FlowDefID=${FlowDefID}`,
        method: 'get'
    })
}

// 查询在办表单
export function GetFormList (Cookie, taskId) {
    return request({
        url: `/GetFormList?Cookie=${Cookie}&TaskID=${taskId}`,
        method: 'get'
    })
}

// 在办-完成
export function SaveFormInfo (Cookie, taskId, userId, data) {
    return request({
        url: `/SaveFormInfo?Cookie=${Cookie}&TaskID=${taskId}&UserID=${userId}`,
        method: 'post',
        data
    })
}

// 在办-保存
export function TaskSave (Cookie, taskId, data) {
    return request({
        url: `/TaskSave?Cookie=${Cookie}&TaskID=${taskId}`,
        method: 'post',
        data
    })
}

// 在办-查询任务详情
export function GetTaskBaseInfo (taskId) {
    return request({
        url: `/GetTaskBaseInfo?TaskID=${taskId}`,
        method: 'get'
    })
}

// 在办-作废流程
export function WorkflowDelete (FLOWID, COOKIE) {
    return request({
        url: `/WorkflowDelete?FlowID=${FLOWID}&Cookie=${COOKIE}`,
        method: 'get'
    })
}

// 在办-任务移交
export function UpdateTaskInfo (CONDITION,TASKID) {
    return request({
        url: `/UpdateTaskInfo?Condition=${CONDITION}&TaskID=${TASKID}`,
        method: 'get'
    })
}

// 在办-查看流程图
export function GetWorkflowDiagram (processInstanceId) {
    return request({
        url: `/GetWorkflowDiagram?processInstanceId=${processInstanceId}`,
        method: 'get'
    })
}

// 在办-任务回退
export function TaskGoBack (processInstanceId,TASKID, textVal) {
    return request({
        url: `/TaskGoBack?PROC_INST_ID_=${processInstanceId}&TaskID=${TASKID}&Comment=${textVal}`,
        method: 'get'
    })
}

// 在办-任务催办
export function WorkflowUrging (processInstanceId, UserName, textVal) {
    return request({
        url: `/TaskGoBack?ProcInstID=${processInstanceId}&UserName=${UserName}&Content=${textVal}`,
        method: 'get'
    })
}

// 在办-任务流转信息
export function GetFlowProcessInfo (processInstanceId) {
    return request({
        url: `/GetFlowProcessInfo?PROC_INST_ID_=${processInstanceId}`,
        method: 'get'
    })
}
// 在办-附件
export function WorkflowFileOperation (TaskID) {
    return request({
        url: `/WorkflowFileOperation?TaskID=${TaskID}&Type=search`,
        method: 'get'
    })
}

// 在办-附件上传到服务器
export function uploadToService (TaskID, FilePath) {
    return request({
        url: `/WorkflowFileOperation?TaskID=${TaskID}&Type=add&FilePath=${FilePath}`,
        method: 'get'
    })
}

// 流程发起权限配置
export function UpdateWorkFlowRight (USERNAME, FORMKEYLIST) {
    return request({
        url: `/UpdateWorkFlowRight?UserName=${USERNAME}&FormKeyList=${FORMKEYLIST}`,
        method: 'get'
    })
}

// 查询节点信息
export function GetActList (FLOWDEFID) {
    return request({
        url: `/GetActList?FlowDefID=${FLOWDEFID}`,
        method: 'get'
    })
}

// 获取字段配置信息
export function GetColumnConfig (ACTID, FORMKEY) {
    return request({
        url: `/GetColumnConfig?ActID=${ACTID}&FormKey=${FORMKEY}`,
        method: 'get'
    })
}

// 保存字段配置信息
export function SaveColumnConfig (ACTID, FORMKEY, COLUMNCONFIG) {
    return request({
        url: `/SaveColumnConfig?ActID=${ACTID}&FormKey=${FORMKEY}&ColumnConfig=${COLUMNCONFIG}`,
        method: 'get'
    })
}

// 获取移交人信息
export function GetTransferList (TASKID, USERID, COOKIE, data) {
    return request({
        url: `/GetTransferList?TaskID=${TASKID}&UserID=${USERID}&Cookie=${COOKIE}`,
        method: 'post',
        data
    })
}

// 移交完成接口
export function SaveFormInfoTransfer (TASKID, USERID, COOKIE, WORKCODE, data) {
    return request({
        url: `/SaveFormInfoTransfer?TaskID=${TASKID}&UserID=${USERID}&Cookie=${COOKIE}&WorkCode=${WORKCODE}`,
        method: 'post',
        data
    })
}

// 事件中心——新增事件接口
export function SaveEvent (EVENTJSON, TABLENAME, CODE, EVENTNAME, data) {
    return request({
        url: `/SaveEvent?EventJson=${EVENTJSON}&TableName=${TABLENAME}&Code=${CODE}&EventName=${EVENTNAME}`,
        method: 'post',
        data
    })
}

// 事件中心——查询事件列表接口
export function GetEventList (EVENTNAME) {
    return request({
        url: `/GetEventList?EventName=${EVENTNAME}&pageIndex=1&pageSize=${1000}&sortFields=&direction=`,
        method: 'get'
    })
}

// 事件中心——事件挂接流程
export function SaveEventConfig (EVENTNAME, data) {
    return request({
        url: `/SaveEventConfig?EventName=${EVENTNAME}`,
        method: 'post',
        data
    })
}

// 事件中心——删除事件
export function EventOperate (EVENTNAME, OPERTYPE, EVENTCODE) {
    return request({
        url: `/EventOperate?EventName=${EVENTNAME}&OperType=${OPERTYPE}&EventCode=${EVENTCODE}`,
        method: 'get'
    })
}

// 事件中心——查看事件详情
export function GetEvent (EVENTNAME) {
    return request({
        url: `/GetEvent?EventName=${EVENTNAME}`,
        method: 'get'
    })
}

// 事件中心——发起事件
export function CreateEvent (EVENTNAME, TABLENAME, EVENTJSON, EVENTCODE, NAME, data) {
    return request({
        url: `/CreateEvent?EventName=${EVENTNAME}&TableName=${TABLENAME}&EventJson=${EVENTJSON}&EventCode=${EVENTCODE}&Name=${NAME}`,
        method: 'post',
        data
    })
}

// 事件中心——查询在办事件列表接口
export function GetEventDoingList (EVENTNAME, TYPE) {
    return request({
        url: `/GetEventDoingList?EventName=${EVENTNAME}&Type=${TYPE}&pageIndex=1&pageSize=${1000}&sortFields=&direction=`,
        method: 'get'
    })
}

// 事件中心——通过流程的key去查流程的ID
export function GetFlowIdByFlowKey (FLOWKEY) {
    return request({
        url: `/GetFlowIdByFlowKey?FlowKey=${FLOWKEY}`,
        method: 'get'
    })
}

// 事件中心——查询在办事件发起的流程
export function GetProcInstByEventCode (EVENTCODE) {
    return request({
        url: `/GetProcInstByEventCode?EventCode=${EVENTCODE}`,
        method: 'get'
    })
}

// 台账查询
export function getTableName(name){
    return request({
        url: `/GetTableGroupMetaV3?tableName=${name}`,
        method: 'get'
    })
}

// 选择器选项的值查询
export function getSelectName(nodeName){
    return request({
        url: `/WorkFlow/175/?nodeName=${nodeName}`,
        method: 'get'
    })
}

// 姓名查询
export function getUserName(name){
    return request({
        url: `/GetAllPerson_PandaWisdom?UserName=${name}`,
        method: 'get'
    })
}

// 人员选择器查询
export function getUserListForRole(){
    return request({
        url: `/getUserListForRole?_version=9999`,
        method: 'get'
    })
}

// 台账的表查询
export function GetAccountPageList(accountName, info){
    return request({
        url: `/GetAccountPageList?pageIndex=${1}&pageSize=${1000}&sortFields=录入时间&direction=desc&accountName=${accountName}&info=${info}`,
        method: 'get'
    })
}

// 查询产品列表
export function GetProduct(){
    return request({
        url: `/GetProduct?tableName=销售管理_产品信息表&plateName=项目`,
        method: 'get'
    })
}

// 查询产品信息
export function GetProductBusiness(TASKID){
    return request({
        url: `/GetProductBusiness?TaskID=${TASKID}`,
        method: 'get'
    })
}

// 查询台账列表
export function GetTZInfo(NAME){
    return request({
        url: `/GetTZInfo?Name=${NAME}`,
        method: 'get'
    })
}

// 查询台账列表
export function AddProduct(data){
    return request({
        url: `/AddProduct`,
        method: 'post',
        data
    })
}

// 组件信息查询接口
export function GetAssemblyModel(ASSEMBLYNAME, ACTID){
    return request({
        url: `/GetAssemblyModel?AssemblyName=${ASSEMBLYNAME}&pageIndex=1&pageSize=1000&sortFields=&direction=&ActID=${ACTID}`,
        method: 'get'
    })
}

// 保存节点视图配置
export function SaveAssemblyConfig(ACTID, data){
    return request({
        url: `/SaveAssemblyConfig?ActID=${ACTID}`,
        method: 'post',
        data
    })
}

// 组件信息操作接口
export function AssemblyOperate(OPERTYPE, ASSEMBLYNAME, data){
    return request({
        url: `/AssemblyOperate?OperType=${OPERTYPE}&AssemblyName=${ASSEMBLYNAME}`,
        method: 'post',
        data
    })
}

// 组件信息操作接口-查新
export function GetAssemblyByTaskID(TASKID){
    return request({
        url: `/GetAssemblyByTaskID?TaskID=${TASKID}`,
        method: 'get'
    })
}

// 流程发起得时候，根据流程ID去查询视图
export function GetAssembly_Start(FLOWDEFID){
    return request({
        url: `/GetAssembly_Start?FlowDefID=${FLOWDEFID}`,
        method: 'get'
    })
}


