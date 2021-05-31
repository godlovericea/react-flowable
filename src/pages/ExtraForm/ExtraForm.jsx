// 外接表单管理
import React, {useEffect, useState, useRef} from 'react'
import {Table, Form, Input, Button, Modal, Space, message } from 'antd'
import {GetAssemblyModel, SaveAssemblyConfig, AssemblyOperate, GetAssemblyByTaskID} from '../../apis/process'
import NoData from '../../components/NoData/NoData'
import {ProductInfo} from '../../libs/extraFormMapping/extraFormMapping'
import moment from 'moment'
import './ExtraForm.less'
const { Search } = Input
const { Column } = Table;

const ExtraForm=()=>{
    const [isModalVisible, setIsModalVisible] = useState(false) // Modal
    const [delModalVisible, setDelModalVisible] = useState(false) // Modal
    const [comModalVisible, setComModalVisible] = useState(false) // Modal
    const [curFormName, setCurFormName] = useState('')
    const [searchName, setSearchName] = useState('')
    const [data, setData] = useState([]) // table数据
    const [total, setTotal] = useState(0) // total
    const [userName, setUserName] = useState('') // total
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
    const getData =(name = '', actId = '')=>{
        GetAssemblyModel(name, actId)
        .then((res)=>{
            if (res.data.say.statusCode === "0000"){
                res.data.getMe.forEach((item, index)=>{
                    item.index = index + 1
                    item.key = index
                })
                setData(res.data.getMe)
                setTotal(res.data.totalRcdNum)
            }
        })
    }

    // 打开模态框
    const openModal=()=>{
        setIsModalVisible(true)
    }

    // 点击确定按钮
    const handleOk=()=>{
        const formName = formNameRef.current.state.value
        const formDesc = formDescRef.current.state.value
        const myData = {
            AssemblyName: formName,
            CreateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
            Creater: userName,
            Describe: formDesc,
            ID: '',
            Type: ''
        }
        AssemblyOperate(1, formName, myData)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                setIsModalVisible(false)
                getData()
            } else {
                message.error(res.data.errMsg)
            }
        })
    }

    // 点击取消按钮
    const handleCancel=()=>{
        setIsModalVisible(false)
    }

    // 预览第三方组件
    const handleShow=()=>{
        return ()=>{
            setComModalVisible(true)
            console.log(ProductInfo)
        }
    }

    // 关闭组件预览Modal
    const handleComOk=()=>{
        setComModalVisible(false)
    }
    // 关闭组件预览Modal
    const handleComCancel=()=>{
        setComModalVisible(false)
    }
    // 删除组件
    const handleDel=(name)=>{
        return ()=>{
            setCurFormName(name)
            setDelModalVisible(true)
        }
    }

    // 确定删除
    const handleDelOk=()=>{
        AssemblyOperate(0, curFormName, {})
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                setDelModalVisible(false)
                getData()
            } else {
                message.error(res.data.errMsg)
            }
        })
    }

    // 取消删除
    const handleDelCancel=()=>{
        setDelModalVisible(false)
        setCurFormName('')
    }

    // 捕获输入框值得变化
    const handleChange=(e)=>{
        setSearchName(e.target.value)
    }
    // 点击搜索
    const handleSearch=(data)=>{
        getData(data)
    }

    const getProductInfo=(data)=>{

    }

    const queryDataFromWeb4=()=>{
        // 处理任务ID，用户名称，用户所在部门
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
            if (item.indexOf("userName") > -1) {
                setUserName(decodeURI(item.split("=")[1]))
            }
        })
    }

    useEffect(()=>{
        queryDataFromWeb4()
        getData()
    }, [])

    return(
        <div className="extraform-wrapper">
            <div className="form-headerbox">
                <Form layout="inline">
                    <Form.Item label="表单名称">
                        <Search placeholder="请输入表单名称" value={searchName} allowClear className="extra-form-content" onChange={handleChange} onSearch={handleSearch} style={{ width: 200 }} />
                    </Form.Item>
                </Form>
                <Button className="localBtnClass rightBtn" size="small" type="primary" onClick={openModal}>新增</Button>
            </div>
            <div className="header-content-divider"></div>
            {
                data.length > 0 ?
                <Table className="customTable" bordered={true} dataSource={data} pagination={pagination} rowClassName="rowClassName">
                    <Column title="序号" dataIndex="index" key="index" width={80} align="center"></Column>
                    <Column title="表单名称" dataIndex="AssemblyName" key="AssemblyName" align="center"/>
                    <Column title="创建人" dataIndex="Creater" key="Creater" align="center"/>
                    <Column title="创建时间" dataIndex="CreateTime" key="CreateTime" align="center"/>
                    <Column title="功能描述" dataIndex="Describe" key="Describe" align="center"/>
                    <Column
                        align="center"
                        title="操作"
                        key="action"
                        width={250}
                        render={(text, record) => (
                            <Space size="middle">
                                <Button type="primary" size="small" className="table-oper-btn" onClick={handleShow(record.AssemblyName)}>预览</Button>
                                <Button type="primary" size="small" className="table-oper-btn" onClick={handleDel(record.AssemblyName)}>删除</Button>
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
            
            <Modal title="提示" visible={delModalVisible} onOk={handleDelOk} onCancel={handleDelCancel}>
                确定删除该表单吗？
            </Modal>

            <Modal title="预览" visible={comModalVisible} onOk={handleComOk} onCancel={handleComCancel} width={1200}>
                <ProductInfo showAddProductButton={true} getProductInfo={getProductInfo}></ProductInfo>
            </Modal>
        </div>
    )
}

export default ExtraForm