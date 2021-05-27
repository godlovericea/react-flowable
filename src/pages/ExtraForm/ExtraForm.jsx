// 外接表单管理
import React, {useEffect, useState, useRef} from 'react'
import {Table, Form, Input, Button, Modal, Space } from 'antd'
import NoData from '../../components/NoData/NoData'
import './ExtraForm.less'
const { Search } = Input
const { Column } = Table;

const ExtraForm=()=>{
    const [isModalVisible, setIsModalVisible] = useState(false) // Modal
    const [data, setData] = useState([]) // table数据
    const [total, setTotal] = useState(0) // total
    const formNameRef = useRef() // 表单名称
    const formDescRef = useRef() // 表单描述
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

    // 拉取数据
    const getData =()=>{

    }

    // 打开模态框
    const openModal=()=>{
        setIsModalVisible(true)
    }

    // 点击确定按钮
    const handleOk=()=>{

    }

    // 点击取消按钮
    const handleCancel=()=>{

    }

    // 预览第三方组件
    const handleShow=()=>{

    }

    // 删除组件
    const handleDel=()=>{

    }

    // 捕获输入框值得变化
    const handleChange=()=>{

    }
    // 点击搜索
    const handleSearch=()=>{

    }

    useEffect(()=>{
        getData()
    }, [])


    return(
        <div className="extraform-wrapper">
            <div className="form-headerbox">
                <Form layout="inline">
                    <Form.Item label="表单名称">
                        <Search placeholder="请输入表单名称" className="input-text-content" onChange={handleChange} onSearch={handleSearch} style={{ width: 200 }} />
                    </Form.Item>
                </Form>
                <Button className="localBtnClass rightBtn" size="small" type="primary" onClick={openModal}>新增</Button>
            </div>
            <div className="header-content-divider"></div>
            {
                data.length > 0 ?
                <Table className="customTable" bordered={true} dataSource={data} pagination={pagination} rowClassName="rowClassName">
                    <Column title="序号" dataIndex="index" key="index" width={80} align="center"></Column>
                    <Column title="事件名称" dataIndex="EventName" key="EventName" align="center"/>
                    <Column title="事件表" dataIndex="EventTable" key="EventTable" align="center"/>
                    <Column title="事件编码" dataIndex="EventCode" key="EventCode" align="center"/>
                    <Column
                        align="center"
                        title="操作"
                        key="action"
                        width={250}
                        render={(text, record) => (
                            <Space size="middle">
                                <Button type="primary" size="small" className="table-oper-btn" onClick={handleShow(record.EventName)}>预览</Button>
                                <Button type="primary" size="small" className="table-oper-btn" onClick={handleDel(record.EventName, record.EventCode)}>删除</Button>
                            </Space>
                        )}
                    />
                </Table>
                :
                <NoData></NoData>
            }
            
            <Modal title="新增事件" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical">
                    <Form.Item label="表单名称">
                        <Input ref={formNameRef} placeholder="请输入表单名称" />
                    </Form.Item>
                    <Form.Item label="表单描述">
                        <Input ref={formDescRef} placeholder="请输入表单描述" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ExtraForm