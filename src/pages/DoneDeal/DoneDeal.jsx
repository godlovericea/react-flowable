import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message, Modal, Radio } from 'antd';
import { GetFormList, SaveFormInfo, TaskSave, GetTaskBaseInfo } from '../../apis/process'
import './DoneDeal.less'

const NeedToDeal = (props) => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    const [cookie, setCookie] = useState("")
    const [taskId, setTaskId] = useState("")
    const [processDefinitionId, setProcessDefinitionId] = useState("")
    const [userId, setUserId] = useState("")
    const [formId, setFormId] = useState("")
    const [visible, setVisible] = useState(false)
    const [modelerVisible, setModelerVisible] = useState(false)
    const [transValue, setTransValue] = useState(null)
    const [processImgSrc, setProcessImgSrc] = useState(null)
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
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("taskId") > -1) {
                taskIdScope = decodeURI(item.split("=")[1])
                setTaskId(taskIdScope)
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
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("processDefinitionId") > -1) {
                setProcessDefinitionId(decodeURI(item.split("=")[1]))
            } else if (item.indexOf("userId") > -1) {
                setUserId(item.split("=")[1])
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
    // 附件
    const uploadFile=()=>{

    }
    // 流转信息
    const showTransFlow=()=>{
        
    }
    // 流程图
    const showModeler=()=>{

    }

    // 移交Modal
    const handleOK=()=>{

    }
    const handleCancel=()=>{

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
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={uploadFile}>附件</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={showTransFlow}>流转信息</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15, width:80 }} onClick={showModeler}>流程图</Button>
            </div>
            <Modal title="任务移交" visible={visible} onOk={handleOK} onCancel={handleCancel}>
                <Radio.Group value={transValue}>

                </Radio.Group>
            </Modal>
            <Modal title="流程图" visible={modelerVisible} onOk={handleModelerOK} onCancel={handleModelerCancel}>
                <img src={processImgSrc} alt="process"/>
            </Modal>
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
            />
        </div>
    );
};

export default NeedToDeal;