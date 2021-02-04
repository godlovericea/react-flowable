import request from '../utils/request'

// 流程列表
export function GetWorkflowBaseInfo (WorkflowName, STime, ETime, pageIndex, pageSize) {
    return request({
        url: '/GetWorkflowBaseInfo?WorkflowName=' + WorkflowName + `&STime=` + STime + `&ETime=` + ETime + `&pageIndex=` + pageIndex + `&pageSize=` + pageSize + `&sortFields=created&direction=desc`,
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

// ?tableName=%E8%B5%84%E4%BA%A7%E7%AE%A1%E7%90%86_%E8%B5%84%E4%BA%A7%E6%98%8E%E7%BB%86%E8%A1%A8&request.preventCache=1611733051203

// 新增流程
export function getAssetsList(){
    return request({
        url: `http://192.168.12.44:8089/CityInterface/rest/services/CountyProduct.svc/AccountManage/GetTableGroupMetaV3?tableName=资产管理_资产明细表&columnName=设备状态`,
        method: 'get'
    })
}