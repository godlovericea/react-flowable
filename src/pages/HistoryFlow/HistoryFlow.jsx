// 查看信息流转历史节点
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import { GetFormList, GetTaskBaseInfo } from '../../apis/process'
import './HistoryFlow.less'
import StaffSelect from '../../components/StaffSelect/StaffSelect'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'

const NeedToDeal = (props) => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    const [cookie, setCookie] = useState("")
    const [formId, setFormId] = useState("")

    // 流程详细信息
    const [Assignee, setAssignee] = useState(null)
    const [ETime, setETime] = useState(null)
    const [STime, setSTime] = useState(null)
    const [TaskName, setTaskName] = useState(null)
    const formRef = useRef();

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
        taskIdScope = props.location.state.taskId
        GetFormList(cookieScope, taskIdScope)
        .then((res)=>{
            if (res.status === 200) {
                let fieldData = res.data
                let schemaConfig =  JSON.parse(fieldData.Config)
                let fieldConfig = schemaConfig.schema.properties
                let formValObj = JSON.parse(fieldData.formId).values
                // 遍历表单配置与提交的values，并赋值
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
        // 获取当前节点信息
        GetTaskBaseInfo(taskIdScope)
        .then((response)=>{
            let data = response.data
            setTaskName(data.TaskName)
            setAssignee(data.Assignee)
            setSTime(data.STime)
            setETime(data.ETime)
        })
    }
    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
        alert(JSON.stringify(res, null, 2));
        });
    };

    const handleClickReback = ()=>{
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
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                widgets={{ staff: StaffSelect, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file: UploadFile, editSearch: EditbleSelct }}
            />
            <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={handleClickReback}>返回</Button>
        </div>
    );
};

export default NeedToDeal;