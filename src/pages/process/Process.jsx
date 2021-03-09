import React from "react";
import { GetWorkflowBaseInfo, UpdateStatus, CreateModel, flowableLogin, GetFormListInfo, DeleteFormLogic } from '../../apis/process'
// import Modeler from "../../components/Modeler";
import { Table, Space, Button, Form, Input, Pagination, Modal, message } from 'antd';
import './process.less'
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
        pageSize: 20,// 当前分页条数
        confirmLoading: false,// 加载新增接口loading效果
        visible: false, // 模态框显示隐藏
        processName: '',// 新增流程名称
        processKey: '',// 新增流程标识
        processDesc: '',// 新增流程描述
        cookieData: '',
        formId: '', // 表单ID
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
    }
    handlePageChange =(curPage, pageSize) => {
        this.setState({
            curPage: curPage,
            pageSize: pageSize
        },()=>{
            console.log(this.state.curPage,this.state.pageSize)
            this.getData()
        })
        
    }
    handlePageSizeChange=(page, size)=>{
        console.log(page)
        console.log(size)
    }
    // 拉取数据
    getData = ()=> {
        GetFormListInfo(this.state.name,this.state.curPage, this.state.pageSize)
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
    // 删除表单
    delForm = (id)=>{
        return ()=>{
            this.setState({
                visible: true,
                formId: id
            })
        }
    }
    handleOk=()=>{
        DeleteFormLogic('', this.state.formId)
        .then((res)=>{
            if(res.data.statusCode === "0000") {
                message.success("删除成功")
                this.setState({
                    visible: false
                })
                this.getData()
            } else {
                message.success(res.data.errMsg)
            }
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
        this.props.history.push({
            pathname: '/new'
        })
    }
    goEdit=(id,name,key,desc)=>{
        return ()=>{
            this.props.history.push({
                pathname: '/edit',
                state:{
                    id: id,
                    name: name,
                    key: key,
                    desc: desc
                }
            })
        }
    }
    goShow=(id)=>{
        // console.log(id)
        return ()=>{
            this.props.history.push({
                pathname: '/show',
                state:{
                    id: id
                }
            })
        }
    }
    // 跳转到台账
    goShowAccount=(name)=>{
        return ()=>{
            this.props.history.push({                              
                pathname: '/trans',
                state:{
                    name: name
                }
            })
        }
    }
    componentDidMount() {
        this.getData()
    }
    render() {
        return(
            <div className="modeler-wrapper">
                {/* <Modeler></Modeler> */}
                <Form layout="inline" >
                    <Form.Item label="流程名称">
                        <Input placeholder="请输入表单名称" allowClear onChange={this.handleProName}/>
                    </Form.Item>
                    <Form.Item>
                        <Button className="localBtnClass" size="small" type="primary" onClick={this.getData}>查询</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button className="localBtnClass" size="small" type="primary" onClick={this.openModal}>新增</Button>
                    </Form.Item>
                </Form>
                <Table dataSource={this.state.tableData} pagination={false} rowClassName="rowClassName">
                    <Column title="流程名称" dataIndex="name" key="WorkflowName" />
                    <Column title="流程标识" dataIndex="key" key="Key" />
                    <Column title="创建人" dataIndex="createdBy" key="createdBy" />
                    <Column title="创建时间" dataIndex="created" key="created" />
                    <Column title="最后修改时间" dataIndex="lastUpdated" key="lastUpdated" />
                    <Column
                        title="操作"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                {
                                    record.Type === '表单' ?
                                    <div>
                                        <Button className="localBtnClass" size="small" type="primary" style={{marginRight:"10px"}} onClick={this.goEdit(record.id, record.name, record.key, record.description)}>编辑</Button>
                                        <Button className="localBtnClass" size="small" type="primary" style={{marginRight:"10px"}} onClick={this.delForm(record.id)}>删除</Button>
                                        <Button className="localBtnClass" size="small" type="primary" onClick={this.goShow(record.id)}>查看</Button>
                                    </div>
                                    :
                                    <div>
                                        <Button className="localBtnClass" size="small" type="primary" style={{marginRight:"10px"}} onClick={this.delForm(record.id)}>删除</Button>
                                        <Button className="localBtnClass" size="small" type="primary" onClick={this.goShowAccount(record.TableName)}>查看</Button>
                                    </div>
                                }
                            </Space>
                        )}
                    />
                </Table>
                <Modal
                    title="提示"
                    visible={this.state.visible}
                    okText="确定"
                    cancelText="取消"
                    onOk={this.handleOk}
                    confirmLoading={this.state.confirmLoading}
                    onCancel={this.handleCancel}
                >
                    确定删除该表单吗？
                </Modal>
                <Pagination
                    current={this.state.curPage}
                    total={this.state.total}
                    showSizeChanger
                    showQuickJumper
                    defaultPageSize={20}
                    onChange = {this.handlePageChange}
                    showTotal={total => `共 ${total} 条数据`}>
                </Pagination>
            </div>
        )
    }
}

export default Process