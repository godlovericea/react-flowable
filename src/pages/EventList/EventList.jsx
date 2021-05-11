// 事件中心列表
import React, { useState, useEffect, useRef } from 'react';
import { Table, Space, Input, Button, Modal, Form, message } from 'antd';
import { GetEventList, EventOperate } from '../../apis/process'
import './EventList.less'
import NoDataImg from '../../assets/nodata.png'
import NoData from '../../components/NoData/NoData'
const { Column } = Table;
const { Search } = Input;


const EventList = (props) => {
    // 事件列表
    const [data, setData] = useState([])
    // 事件名称
    const [eventName, setEventName] = useState('')
    // 事件编号
    const [EventCode, setEventCode] = useState('')
    // 滚动高度
    const [clientHeight, setClientHeight] = useState(0)
    // 事件类型的名称输入框
    const eventNameRef = useRef()
    // 事件类型描述输入框
    const eventDescRef = useRef()
    // Modal
    const [isModalVisible, setIsModalVisible] = useState(false)
    // 删除Modal
    const [isDelEvent, setIsDelEvent] = useState(false)
    // total
    const [total, setTotal] = useState(0)
    
    // 设置分页属性，20条/页
    const [pagination, setPagination] = useState({
        hideOnSinglePage: false,
        pageSizeOptions: [20,30,50],
        showQuickJumper: true,
        total: total,
        showTotal: total => `总共 ${total} 条数据`,
        size: 'small',
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
                pathname: '/form-render/eventper',
                state:{
                    name: name
                }
            })
        }
    }
    // 打开新增事件
    const goToNewEventForm=()=>{
        props.history.push({
            pathname: '/form-render/newevform'
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

    // 查看事件
    const handleShow=(name)=>{
        return ()=>{
            props.history.push({
                pathname: '/form-render/eventshow',
                state: {
                    name: name
                }
            })
        }
    }
    // 确定删除
    const handleSureDel=()=>{
        EventOperate(eventName, 0, EventCode)
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
    const handleDel=(name, code)=>{
        return ()=>{
            setEventName(name)
            setEventCode(code)
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
    const getData =async(eventName = '')=>{
        let result = await GetEventList(eventName)
        result.data.getMe.forEach((item, index)=>{
            item.index = index+ 1
            item.key = item.ID
        })
        setData(result.data.getMe)
        setTotal(result.data.totalRcdNum)
    }

    const computeHeight=()=>{
        var height = document.documentElement.clientHeight;
        // console.log(height)
        setClientHeight(height - 190)
    }

    useEffect(()=>{
        computeHeight()
        getData()
    }, [])

    return (
        <div className="eventList-wrapper">
            <div className="form-headerbox">
                <Form layout="inline">
                    <Form.Item label="事件名称">
                        <Search
                            className="input-text-content"
                            placeholder="请输入事件名称"
                            onSearch={onSearch}
                            style={{width: 200}}
                        />
                    </Form.Item>
                </Form>
                <Button type="primary" className="rightBtn" onClick={goToNewEventForm}>新增事件</Button>
            </div>
            <div className="header-content-divider"></div>
            {
                data.length > 0 ?
                <Table className="customTable" bordered={true} dataSource={data} pagination={pagination} rowClassName="rowClassName" /**scroll={{y: clientHeight}}*/>
                    <Column title="序号" dataIndex="index" key="index" width={80} align="center"></Column>
                    <Column title="事件名称" dataIndex="EventName" key="EventName" align="center"/>
                    <Column title="事件表" dataIndex="EventTable" key="EventTable" align="center"/>
                    <Column title="事件编码" dataIndex="EventCode" key="EventCode" align="center"/>
                    {/* <Column title="当前处理人" dataIndex="current" key="current" />
                    <Column title="描述" dataIndex="lastName" key="lastName" />
                    <Column title="创建时间" dataIndex="age" key="age" />
                    <Column title="修改时间" dataIndex="address" key="address" /> */}
                    <Column
                        align="center"
                        title="操作"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                <Button type="primary" size="small" className="table-oper-btn" onClick={handleShow(record.EventName)}>事件表单</Button>
                                <Button type="primary" size="small" className="table-oper-btn" onClick={handleDel(record.EventName, record.EventCode)}>删除</Button>
                                <Button type="primary" size="small" className="table-oper-btn" onClick={handleConfig(record.EventName)}>流程配置</Button>
                                {/* <Button type="primary" size="small" onClick={handleEventConfig(record.EventName)}>事件权限配置</Button> */}
                            </Space>
                        )}
                    />
                </Table>
                :
                <NoData></NoData>
            }
            
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

export default EventList
