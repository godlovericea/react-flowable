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