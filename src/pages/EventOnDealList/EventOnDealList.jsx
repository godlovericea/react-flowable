// 事件中心——在办事件列表
import React, { useState, useEffect, useRef } from 'react';
import { Table, Space, Input, Button, Modal, Form, message, Select } from 'antd';
import { GetEventDoingList, EventOperate, GetProcInstByEventCode, GetFlowProcessInfo, flowableLogin} from '../../apis/process'
import './EventOnDealList.less'
import configData from '../../utils/config'
import reactCookie from 'react-cookies'
import moment from 'moment'
const { Column } = Table;
const { Search } = Input;
const { Option } = Select;


const EventOnDealList = (props) => {
    // 用户ID
    const [userId, setUserId] = useState('')
    // 事件列表
    const [data, setData] = useState([])
    // 事件名称
    const [eventName, setEventName] = useState('')
    // 事件类型
    const [eventType, setEventType] = useState(0)

    const [userName, setUserName] = useState("")
    
    const [userDepart, setUserDepart] = useState("")
    const [loginName,setLoginName] = useState("")
    // 事件类型的名称输入框
    const eventNameRef = useRef()
    // 事件类型描述输入框
    const eventDescRef = useRef()
    // Modal
    const [isModalVisible, setIsModalVisible] = useState(false)
    // 删除Modal
    const [isDelEvent, setIsDelEvent] = useState(false)

    // 事件已发起流程列表
    const [flowData, setFlowData] = useState([])

    // 流程图Modal
    const [modelerVisible, setModelerVisible] = useState(false)

    // 流程图图片地址
    const [processImgSrc, setProcessImgSrc] = useState(null)

    // 流转信息Modal
    const [flowVisible, setFlowVisible] = useState(false)
    // 流转信息列表
    const [flowTableData, setFlowTableData] = useState([])
    
    // 设置分页属性，20条/页
    const [pagination, setPagination] = useState({
        pageSize: 20
    })
    // 搜索按钮
    const onSearch =(data) =>{
        setEventName(data)
        getData(data, eventType)
    }
    // 跳转到事件权限配置
    const handleEventConfig=(name)=>{
        return ()=>{
            props.history.push({
                pathname: '/form-render/eventper',
                state:{
                    name: name
                }
            })
        }
    }
    // 打开查询以发起流程
    const openShowStartedFlow=(evname, evjson, evcode)=>{
        return ()=>{
            GetProcInstByEventCode(evcode)
            .then((res)=>{
                if (res.data.say.statusCode === "0000") {
                    res.data.getMe.forEach((item,index)=>{
                        item.index = index + 1
                        item.StartTime = moment(item.StartTime).format("YYYY-MM-DD HH:mm:ss")
                        item.EndTime = moment(item.EndTime).format("YYYY-MM-DD HH:mm:ss")
                        item.key = index
                    })
                    setFlowData(res.data.getMe)
                } else {
                    message.error(res.data.say.errMsg)
                }
            })
            setIsModalVisible(true)
        }
        
    }
    // 点击确定新增事件类型
    const handleOk=()=>{
        setIsModalVisible(false)
    }
    // 点击取消按钮，取消新增
    const handleCancel=()=>{
        setIsModalVisible(false)
    }
    // 打开流程图
    const showModelerImg = (FlowName, ProcInstID, ProcCode) =>{
        return ()=>{
            const imgSrc =  configData.baseURL + '/rest/Services/PandaWorkflow.svc/GetWorkflowDiagram?processInstanceId=' + ProcInstID + '&t=' + (new Date()).getTime()
            setProcessImgSrc(imgSrc)
            setModelerVisible(true)
            setIsModalVisible(false)
        }
    }
    // 关闭流程图Modal
    const closeModeler=()=>{
        setModelerVisible(false)
        setIsModalVisible(true)
    }

    // 查看流转信息
    const showTransfer=(FlowName, ProcInstID, ProcCode)=>{
        return ()=>{
            GetFlowProcessInfo(ProcInstID)
            .then((res)=>{
                res.data.getMe.forEach((item,index)=>{
                    item.STime = moment(item.STime).format("YYYY-MM-DD HH:mm:ss")
                    if (item.ETime) {
                        item.ETime = moment(item.ETime).format("YYYY-MM-DD HH:mm:ss")
                    }
                    item.key = index
                    item.index = index +1
                })
                setFlowTableData(res.data.getMe)
                setFlowVisible(true)
            })
        }
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
                pathname: '/form-render/hisflow',
                state:{
                    taskId: taskId,
                    userName: userName,
                    userDepart: userDepart
                }
            })
        }
    }
    // 操作事件
    const handleOperate=(name, evJson, evCode)=>{
        return ()=>{
            console.log(userId)
            props.history.push({
                pathname: '/form-render/eventoper',
                state: {
                    name: name,
                    evJson: evJson,
                    code: evCode,
                    userId: userId,
                    loginName: loginName,
                    userName: userName
                }
            })
        }
    }
    // 确定删除
    const handleSureDel=()=>{
        EventOperate(eventName, 0)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                getData()
                setIsDelEvent(false)
                message.success("删除成功")
            }else {
                message.error(res.data.errMsg)
            }
        })
    }
    // 不删除
    const handleCancelDel=()=>{
        setIsDelEvent(false)
    }
    // 删除事件类型
    const handleDel=(name)=>{
        return ()=>{
            setEventName(name)
            setIsDelEvent(true)
        }
        
    }
     // 配置事件流程
    const handleConfig=(name) =>{
        return ()=>{
            props.history.push({
                pathname: '/form-render/eventconfig',
                state: {
                    name: name
                }
            })
        }
    }

    // 拉取数据
    const getData =async(eventName = '', type = 0)=>{
        let result = await GetEventDoingList(eventName, type)
        result.data.getMe.forEach((item, index)=>{
            item.EventIndex = index + 1
            item.key = index
            item.ReportTime = moment(item.ReportTime).format("YYYY-MM-DD HH:mm:ss")
        })
        setData(result.data.getMe)
    }

    // 筛选事件类型
    const handleChange = (e) => {
        setEventType(e)
        getData(eventName, eventType)
    }
    // 登录到Flowable
    const LoginToFlowable = (userLoginName)=>{
        const myData = {
            _spring_security_remember_me:true,
            j_password:"test",
            j_username: userLoginName,
            submit:"Login"
        }
        flowableLogin(myData)
        .then((res)=>{
            if (res.data.indexOf('FLOWABLE_REMEMBER_ME') < 0) {
                message.error("流程引擎服务不可用，请联系管理员")
                return
            }
            let inFifteenMinutes = new Date(new Date().getTime() + 30*24 * 3600 * 1000);//30天
            let resArr = res.data.split(';')
            let cookieKeyVal = resArr[0]
            let cookieArr = cookieKeyVal.split('=')
            reactCookie.save(
                cookieArr[0],
                cookieArr[1],
                {
                    path: '/',
                    expires: inFifteenMinutes
                }
            )
        })
    }

    useEffect(()=>{
        // 用户ID
        let userId = ""
        let userName = ""
        let userDepart = ""
        let loginName = ""
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
        // 循环接续值
        searchArr.forEach((item)=>{
            if (item.indexOf("userId") > -1) {
                userId = item.split("=")[1]
                setUserId(userId)
            } else if (item.indexOf("userName") > -1) {
                userName = decodeURI(item.split("=")[1])
                setUserName(userName)
            } else if (item.indexOf("userDepart") > -1) {
                userDepart = decodeURI(item.split("=")[1])
                setUserDepart(userDepart)
            } else if (item.indexOf("loginName") > -1) {
                loginName = item.split("=")[1]
                console.log(loginName, "loginName")
                setLoginName(loginName)
            }
        })
        getData()
        LoginToFlowable(loginName)
    }, [])

    return (
        <div className="eventList-wrapper">
            <div className="eventList-header">
                <span>事件类型：</span>
                <Select defaultValue={0} style={{ width: 200 }} onChange={handleChange}>
                    <Option value={1}>全部</Option>
                    <Option value={0}>在办</Option>
                    {/* <Option value={2}>已办</Option> */}
                </Select>
                <span style={{marginLeft: '15px'}}>事件名称：</span>
                <Search
                    placeholder="请输入事件名称"
                    allowClear
                    enterButton="查询"
                    onSearch={onSearch}
                    style={{width: '300px'}}
                />
                {/* <Button type="dashed" onClick={goToNewEventForm}>新增</Button> */}
            </div>
            <Table dataSource={data} pagination={pagination} rowClassName="rowClassName">
                <Column title="序号" width={60} dataIndex="EventIndex" key="EventIndex" />
                <Column title="事件名称" dataIndex="EventName" key="EventName" />
                <Column title="事件表" dataIndex="EventTable" key="EventTable" />
                <Column title="事件编码" dataIndex="EventCode" key="EventCode" />
                <Column title="事件发起人" dataIndex="ReportMan" key="ReportMan" />
                <Column title="发起时间" dataIndex="ReportTime" key="ReportTime" />
                <Column 
                    title="事件状态" 
                    key="EventState"
                    render={(text, record) => {
                        return (
                            record.EventState !== "已关闭"?
                            "进行中"
                            :
                            record.EventState
                        )
                    }}
                />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => {
                        return (
                            record.EventState !== "已关闭"?
                            <Space size="middle">
                                <Button type="primary" size="small" onClick={handleOperate(record.EventName, record.EventJson, record.EventCode)}>操作</Button>
                                <Button type="primary" size="small" onClick={openShowStartedFlow(record.EventName, record.EventJson, record.EventCode)}>查看已发起流程</Button>
                            </Space>
                            :
                            ""
                        )
                    }}
                />
                {/* <Column
                    title="操作"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="primary" size="small" onClick={handleOperate(record.EventName, record.EventJson, record.EventCode)}>操作</Button>
                        </Space>
                    )}
                /> */}
            </Table>
            <Modal title="已发起流程" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={1200}>
                <Table dataSource={flowData} rowClassName="rowClassName">
                    <Column title="序号" width={60} dataIndex="index" key="index" />
                    <Column title="流程名称" dataIndex="FlowName" key="FlowName" />
                    <Column title="流程发起人" dataIndex="Creater" key="ReportMan" />
                    <Column title="流程发起时间" dataIndex="StartTime" key="StartTime" />
                    <Column title="流程结束时间" dataIndex="EndTime" key="EndTime" />
                    <Column title="事件流程编码" dataIndex="ProcCode" key="ProcCode" />
                    <Column
                        title="操作"
                        key="action"
                        render={(text, record) => {
                            return (
                                <Space size="middle">
                                    <Button type="primary" size="small" onClick={showModelerImg(record.FlowName, record.ProcInstID, record.ProcCode)}>流程图</Button>
                                    <Button type="primary" size="small" onClick={showTransfer(record.FlowName, record.ProcInstID, record.ProcCode)}>流转信息</Button>
                                </Space>
                            )
                        }}
                    />
                </Table>
            </Modal>
            <Modal title="流程图" visible={modelerVisible} onCancel={closeModeler} onOk={closeModeler} width={1000}
                bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <img src={processImgSrc} alt="process"/>
            </Modal>
            <Modal title="流转信息" visible={flowVisible} onCancel={closeFlow} onOk={sureFlow} width={900}
            bodyStyle={{ display: 'flex',justifyContent: 'center',alignItems:'center'}}>
                <Table dataSource={flowTableData} pagination={false} rowClassName="rowClassName" style={{width:'100%'}}>
                    <Column title="序号" width={60} dataIndex="index" key="index" />
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
        </div>
    )
}

export default EventOnDealList
