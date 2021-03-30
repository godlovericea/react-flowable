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

// 登录
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

// 任务发起
export function WorkflowStart (cookie, userId, data) {
    return request({
        url: `/WorkflowStart?Cookie=${cookie}&UserID=${userId}`,
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
export function TaskSave (Cookie, taskId, userId, data) {
    return request({
        url: `/TaskSave?Cookie=${Cookie}&TaskID=${taskId}&UserID=${userId}`,
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

// 在办-任务移交
export function UpdateTaskInfo (CONDITION,TASKID) {
    return request({
        url: `/UpdateTaskInfo?Condition=${CONDITION}&TaskID=${TASKID}`,
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

// 新增流程  
export function getAssetsList(){
    return request({
        url: `http://localhost:8089/CityInterface/rest/services/CountyProduct.svc/AccountManage/GetTableGroupMetaV3?tableName=资产管理_资产明细表&columnName=设备状态`,
        method: 'get'
    })
}

// 台账查询
export function getTableName(name){
    return request({
        url: `http://localhost:8089/CityInterface/rest/services/CountyProduct.svc/AccountManage/GetTableGroupMetaV3?tableName=${name}`,
        method: 'get'
    })
}

// 选择器选项的值查询
export function getSelectName(nodeName){
    return request({
        url: `http://localhost:8089/CityInterface/Services/CityServer_WorkFlow/REST/WorkFlowREST.svc/WorkFlow/175/?nodeName=${nodeName}`,
        method: 'get'
    })
}

// 姓名查询
export function getUserName(name){
    return request({
        url: `http://localhost:8089/CityInterface/rest/services/OA.svc/GetAllPerson_PandaWisdom?UserName=${name}`,
        method: 'get'
    })
}

// 人员选择器查询
export function getUserListForRole(){
    return request({
        url: `http://localhost:8089/Cityinterface/rest/services/CountyProduct.svc/AccountManage/getUserListForRole?_version=9999`,
        method: 'get'
    })
}

// 台账的表查询
export function GetAccountConfigInfo(accountName){
    return request({
        url: `http://localhost:8089/CityInterface/Services/CityServer_CaseManage/REST/CaseManageREST.svc/GetAccountConfigInfo?accountName=${accountName}`,
        method: 'get'
    })
}

// 台账的表查询
export function GetAccountPageList(pageIndex, pageSize, accountName, info){
    return request({
        url: `http://localhost:8089/CityInterface/Services/CityServer_CaseManage/REST/CaseManageREST.svc/GetAccountPageList?pageIndex=${pageIndex}&pageSize=${pageSize}&sortFields=录入时间&direction=desc&accountName=${accountName}&info=${info}`,
        method: 'get'
    })
}
