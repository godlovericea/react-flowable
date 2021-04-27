// 已办查询
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, Modal } from 'antd';
import configData from '../../utils/config'
import { GetFormList, GetTaskBaseInfo } from '../../apis/process'
import './DoneDeal.less'

const DoneDeal = (props) => {
    // FormRender的FormData
    const [formData, setFormData] = useState({});
    // FormRender的schema
    const [schema, setSchema] = useState({})
    // flowable-engine鉴权的cookie
    const [cookie, setCookie] = useState("")
    // 当前节点的任务ID
    const [taskId, setTaskId] = useState("")
    // 当前节点的流程定义ID
    const [processDefinitionId, setProcessDefinitionId] = useState("")
    // 用户ID
    const [userId, setUserId] = useState("")
    // 表单ID
    const [formId, setFormId] = useState("")
    // 查看流程图的Modal
    const [modelerVisible, setModelerVisible] = useState(false)
    // 流程图图片
    const [processImgSrc, setProcessImgSrc] = useState(null)

    // 流程详细信息
    const [Assignee, setAssignee] = useState(null)
    const [ETime, setETime] = useState(null)
    const [STime, setSTime] = useState(null)
    const [TaskName, setTaskName] = useState(null)

    // FormRender的ref
    const formRef = useRef();

    // 拉取数据
    const getData =()=>{
        let cookieScope = ""
        let taskIdScope = ""
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
        // 处理任务ID
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
            }
        })
        GetFormList(cookieScope, taskIdScope)
        .then((res)=>{
            if (res.status === 200) {
                let fieldData = res.data
                let schemaConfig =  JSON.parse(fieldData.Config)
                let fieldConfig = schemaConfig.schema.properties
                let formValObj = JSON.parse(fieldData.formId).values
                // 根据配置文件以及表单提交时候的values，给表单加默认值
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

        // 处理任务ID，用户ID
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
            pathname: '/form-render/home'
        })
    }
    // 附件
    const uploadFile=()=>{

    }
    // 流转信息
    const showTransFlow=()=>{
        
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
        <div className="doneneedWrap">
            <div className="donedeal-headerbox">
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
            {/* <Modal title="流转信息" visible={flowVisible} onCancel={closeFlow} onOk={sureFlow} width={900}
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
            </Modal> */}

            {/* <Modal title="附件" visible={fileVisible} onCancel={closeFileVisible} okText="上传附件" onOk={openUploadVisible} width={680}
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
            </Modal> */}
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
            />
        </div>
    );
};

export default DoneDeal;