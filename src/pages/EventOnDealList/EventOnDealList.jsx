// 事件中心——在办事件列表
import React, { useState, useEffect, useRef } from 'react';
import { Table, Space, Input, Button, Modal, Form, message, Select } from 'antd';
import { GetEventDoingList, EventOperate } from '../../apis/process'
import './EventOnDealList.less'
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
    // 事件类型的名称输入框
    const eventNameRef = useRef()
    // 事件类型描述输入框
    const eventDescRef = useRef()
    // Modal
    const [isModalVisible, setIsModalVisible] = useState(false)
    // 删除Modal
    const [isDelEvent, setIsDelEvent] = useState(false)
    
    // 设置分页属性，20条/页
    const [pagination, setPagination] = useState({
        pageSize: 20
    })
    // 搜索按钮
    const onSearch =(data) =>{
        getData(data)
    }
    // 跳转到事件权限配置
    const handleEventConfig=(name)=>{
        return ()=>{
            props.history.push({
                pathname: '/eventper',
                state:{
                    name: name
                }
            })
        }
    }
    // 打开新增事件
    const goToNewEventForm=()=>{
        props.history.push({
            pathname: '/newevform'
        })
        setIsModalVisible(true)
    }
    // 点击确定新增事件类型
    const handleOk=()=>{
        console.log(eventDescRef.current.state.value)
        console.log(eventNameRef.current.state.value)
        setIsModalVisible(false)
    }
    // 点击取消按钮，取消新增
    const handleCancel=()=>{
        setIsModalVisible(false)
        eventDescRef.current.state.value = ''
        eventNameRef.current.state.value = ''
    }

    // 操作事件
    const handleOperate=(name, evJson, evCode)=>{
        return ()=>{
            console.log(userId)
            props.history.push({
                pathname: '/eventoper',
                state: {
                    name: name,
                    evJson: evJson,
                    code: evCode,
                    userId: userId
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
                pathname: '/eventconfig',
                state: {
                    name: name
                }
            })
        }
    }

    // 拉取数据
    const getData =async(eventName = '', type = '')=>{
        let result = await GetEventDoingList(eventName, type)
        result.data.getMe.forEach((item, index)=>{
            item.EventIndex = index + 1
            item.key = index
        })
        setData(result.data.getMe)
    }

    // 筛选事件类型
    const handleChange = (e) => {
        console.log(e)
    }

    useEffect(()=>{
        // 用户ID
        let userId = ""
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        // 循环接续值
        searchArr.forEach((item)=>{
            if (item.indexOf("userId") > -1) {
                userId = item.split("=")[1]
                setUserId(userId)
            }
        })
        getData()
    }, [])

    return (
        <div className="eventList-wrapper">
            <div className="eventList-header">
                <span>事件类型：</span>
                <Select defaultValue={1} style={{ width: 200 }} onChange={handleChange}>
                    <Option value={1}>在办</Option>
                    <Option value={0}>已办</Option>
                    <Option value={2}>全部</Option>
                </Select>
                <span>事件名称：</span>
                <Search
                    placeholder="请输入事件名称"
                    allowClear
                    enterButton="查询"
                    onSearch={onSearch}
                    style={{width: '300px'}}
                />
                <Button type="dashed" onClick={goToNewEventForm}>新增</Button>
            </div>
            <Table dataSource={data} pagination={pagination}>
                <Column title="序号" width={60} dataIndex="EventIndex" key="EventIndex" />
                <Column title="事件名称" dataIndex="EventName" key="EventName" />
                <Column title="事件表" dataIndex="EventTable" key="EventTable" />
                <Column title="事件编码" dataIndex="EventCode" key="EventCode" />
                <Column title="事件发起人" dataIndex="ReportMan" key="ReportMan" />
                <Column title="发起时间" dataIndex="ReportTime" key="ReportTime" />
                <Column title="事件状态" dataIndex="EventState" key="EventState" />
                <Column
                    title="操作"
                    key="action"
                    render={(text, record) => {
                        return (
                            record.EventState !== "已关闭"?
                            <Space size="middle">
                                <Button type="primary" size="small" onClick={handleOperate(record.EventName, record.EventJson, record.EventCode)}>操作</Button>
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
            <Modal title="新增事件" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item label="事件名称">
                        <Input ref={eventNameRef} placeholder="请输入事件名称" />
                    </Form.Item>
                    <Form.Item label="事件描述">
                        <Input ref={eventDescRef} placeholder="请输入事件描述" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="删除事件" visible={isDelEvent} onOk={handleSureDel} onCancel={handleCancelDel}>
                <p>确定删除该事件吗？</p>
            </Modal>
        </div>
    )
}

export default EventOnDealList
