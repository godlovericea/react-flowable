// 事件类型列表
import React, { useState, useEffect, useRef } from 'react';
import { Table, Space, Input, Button, Modal, Form } from 'antd';
import './EventTypeList.less'
const { Column } = Table;
const { Search } = Input;

let data = []
for(let i = 0;i < 30; i++) {
    data.push({
        key: i+1,
        firstName: 'John',
        lastName: 'Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    })
}


const EventTypeList = (props) => {
    // 事件类型的名称输入框
    const eventNameRef = useRef()
    // 事件类型描述输入框
    const eventDescRef = useRef()
    // Modal
    const [isModalVisible, setIsModalVisible] = useState(false)
    // 设置分页属性，20条/页
    const [pagination, setPagination] = useState({
        pageSize: 20
    })
    // 搜索按钮
    const onSearch =(data) =>{
        // console.log(data)
    }
    // 打开弹框
    const openDialog=()=>{
        setIsModalVisible(true)
    }
    // 点击确定新增事件类型
    const handleOk=()=>{
        // console.log(eventDescRef.current.state.value)
        // console.log(eventNameRef.current.state.value)
        setIsModalVisible(false)
    }
    // 点击取消按钮，取消新增
    const handleCancel=()=>{
        setIsModalVisible(false)
        eventDescRef.current.state.value = ''
        eventNameRef.current.state.value = ''
    }

    // 删除事件类型
    const handleDel = (id) => {
        return ()=>{
            // console.log(id)
        }
        
    }
     // 编辑事件类型
    const handleEdit=(id, name, desc) => {
        return ()=>{
            // console.log(id, name, desc)
        }
    }
    // 点击配置流程
    const handleFlow = (id, name) => {
        return ()=>{
            props.history.push({
                pathname: '/form-render/eventconfig',
                state:{
                    id: id,
                    name: name
                }
            })
        }
    }
    // 拉取数据
    const getData =()=>{

    }

    useEffect(()=>{
        getData()
    })

    return (
        <div className="event-typeList-wrapper">
            <div className="event-typeList-header">
                <Search
                    placeholder="请输入事件类型的名称"
                    allowClear
                    enterButton="查询"
                    onSearch={onSearch}
                    style={{width: '300px'}}
                />
                <Button type="dashed" onClick={openDialog}>新增</Button>
            </div>
            <Table dataSource={data} pagination={pagination}>
                <Column title="事件类型" dataIndex="firstName" key="firstName" />
                <Column title="描述" dataIndex="lastName" key="lastName" />
                <Column title="创建时间" dataIndex="age" key="age" />
                <Column title="修改时间" dataIndex="address" key="address" />
                <Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button type="primary" size="small" onClick={handleDel(record.id)}>删除</Button>
                            <Button type="primary" size="small" onClick={handleEdit(record.id, record.name, record.desc)}>编辑</Button>
                            <Button type="primary" size="small" onClick={handleFlow(record.id, record.name)}>流程配置</Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal title="新增事件类型" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item label="事件类型名称">
                        <Input ref={eventNameRef} placeholder="请输入事件类型名称" />
                    </Form.Item>
                    <Form.Item label="事件类型描述">
                        <Input ref={eventDescRef} placeholder="请输入事件类型描述" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default EventTypeList