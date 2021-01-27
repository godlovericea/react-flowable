import React from "react";
import { GetWorkflowBaseInfo, UpdateStatus, CreateModel, flowableLogin } from '../../apis/process'
// import Modeler from "../../components/Modeler";
import { Table, Tag, Space, Button, Form, Input, DatePicker, Pagination, Modal } from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Column } = Table;
class Process extends React.Component{
    state={
        tableData: [],// 表格数据
        name: '', // 检索栏流程名称
        startDate: '',// 检索栏起始日期
        endDate: '',// 检索栏截止日期
        total: 0, // 数据总数
        curPage: 1,// 当前页码
        pageSize: 10,// 当前分页条数
        confirmLoading: false,// 加载新增接口loading效果
        visible: false, // 模态框显示隐藏
        processName: '',// 新增流程名称
        processKey: '',// 新增流程标识
        processDesc: '',// 新增流程描述
        cookieData: ''
    }
    mockLogin=()=>{
        const myData = {
            j_username: 'admin',
            j_password: 'test',
            submit: 'Login',
            _spring_security_remember_me: true
        }
        flowableLogin(myData)
        .then((res)=>{
            let cookieData = res.data.split(';')[0].split('=')[1]
            this.setState({
                cookieData: cookieData
            })
        })
    }
    handleProName = (e)=>{
        this.setState({
            name: e.target.value
        })
    }
    handleDateChange =(date, dateString)=>{
        console.log(date)
        console.log(dateString)
        this.setState({
            startDate: !dateString[0] ? '' : dateString[0] + ' ' + '00:00:00',
            endDate: !dateString[1]? '' : dateString[1] + ' ' +'23:59:59',
        })
        console.log(this.state.startDate)
        console.log(this.state.endDate)
    }
    handlePageChange =(curPage, pageSize) => {
        console.log(curPage)
        console.log(pageSize)
        this.setState({
            curPage: curPage,
            pageSize: pageSize
        })
        this.getData()
    }
    handlePageSizeChange=(page, size)=>{
        console.log(page)
        console.log(size)
    }
    // 拉取数据
    getData = ()=> {
        GetWorkflowBaseInfo(this.state.name,this.state.startDate || '',this.state.endDate || '',this.state.curPage, this.state.pageSize)
        .then(res=>{
            this.setState({
                tableData: res.data.getMe,
                total: res.data.totalRcdNum
            })
        })
    }
    // 删除流程
    delProcess =(record) =>{
        return ()=>{
            UpdateStatus(record.ID, 0)
            .then((res)=>{
                this.getData()
            })
        }
    }
    handleOk=()=>{
        const myData = {
            name: this.state.processName,
            key: this.state.processKey,
            description: this.state.processDesc,
            modelType: 0
        }
        CreateModel(this.state.cookieData, myData)
        .then((res)=>{
            console.log(res)
            this.setState({
                visible: false
            })
        })
    }
    handleCancel=()=>{
        this.setState({
            visible: false
        })
    }
    handleCreateProcessName=(e)=>{
        this.setState({
            processName: e.target.value
        })
    }
    handleCreateProcessKey=(e)=>{
        this.setState({
            processKey: e.target.value
        })
    }
    handleCreateProcessDesc=(e)=>{
        this.setState({
            processDesc: e.target.value
        })
    }
    openModal=()=>{
        this.setState({
            visible: true
        })
    }
    componentDidMount() {
        this.getData()
        this.mockLogin()
        
    }
    render() {
        return(
            <div className="modeler-wrapper">
                {/* <Modeler></Modeler> */}
                <Form layout="inline" >
                    <Form.Item label="流程名称">
                        <Input placeholder="请输入流程名称" allowClear onChange={this.handleProName}/>
                    </Form.Item>
                    <Form.Item label="日期范围">
                        <RangePicker
                            format={'YYYY-MM-DD'}
                            onChange={this.handleDateChange}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={this.getData}>查询</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="dashed" onClick={this.openModal}>新增</Button>
                    </Form.Item>
                </Form>
                <Table dataSource={this.state.tableData} pagination={false}>
                    <Column title="流程名称" dataIndex="WorkflowName" key="WorkflowName" />
                    <Column title="流程标识" dataIndex="Key" key="Key" />
                    <Column title="创建时间" dataIndex="Creatime" key="Creatime" />
                    <Column title="最后修改时间" dataIndex="LastUpdateTime" key="LastUpdateTime" />
                    <Column title="流程版本" dataIndex="Version" key="Version" />
                    <Column title="部署编码" dataIndex="DeployCode" key="DeployCode" />
                    <Column
                        title="操作"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                {
                                    !record.FlowID ?
                                    <div>
                                        <Button type="ghost">编辑{record.name}</Button>
                                        <Button type="primary">部署{record.name}</Button>
                                        <Button type="danger" onClick={this.delProcess(record)}>删除</Button>
                                    </div>
                                    :
                                    <div>
                                        <Button type="primary">发起</Button>
                                        <Button type="primary">取消部署</Button>
                                    </div>
                                }
                            </Space>
                        )}
                    />
                </Table>
                <Modal
                    title="新增流程"
                    visible={this.state.visible}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    <Form layout="vertical" preserve={false}>
                        <Form.Item label="流程名称">
                            <Input placeholder="请输入流程名称" onChange={this.handleCreateProcessName}/>
                        </Form.Item>
                        <Form.Item label="流程标识">
                            <Input placeholder="请输入流程标识" onChange={this.handleCreateProcessKey}/>
                        </Form.Item>
                        <Form.Item label="流程描述">
                            <TextArea placeholder="请输入流程描述" onChange={this.handleCreateProcessDesc}></TextArea>
                        </Form.Item>
                    </Form>
                </Modal>
                <Pagination
                    current={this.state.curPage}
                    total={this.state.total}
                    showSizeChanger
                    showQuickJumper
                    onChange = {this.handlePageChange}
                    onShowSizeChange={this.handlePageSizeChange}
                    showTotal={total => `共 ${total} 条数据`}>
                </Pagination>
            </div>
        )
    }
}

export default Process