// 表单管理的列表
import React from "react";
import { UpdateStatus, GetFormListInfo, DeleteFormLogic, flowableLogin } from '../../apis/process'
// import Modeler from "../../components/Modeler";
import { Table, Space, Button, Form, Input, Pagination, Modal, message } from 'antd';
import './process.less'
import moment from 'moment';
import NoData from '../../components/NoData/NoData'
import reactCookie from 'react-cookies'
const { Search } = Input
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
        cookieData: '', // flowable-engine鉴权的cookie
        formId: '', // 表单ID
        clientHeight: 0,
    }
    // 流程名称
    handleProName = (e)=>{
        this.setState({
            name: e.target.value
        })
    }
    // 获取流程创建的日期
    handleDateChange =(date, dateString)=>{
        this.setState({
            startDate: !dateString[0] ? '' : dateString[0] + ' ' + '00:00:00',
            endDate: !dateString[1]? '' : dateString[1] + ' ' +'23:59:59',
        })
    }
    // 翻页
    handlePageChange =(curPage, pageSize) => {
        this.setState({
            curPage: curPage,
            pageSize: pageSize
        },()=>{
            this.getData(this.state.name)
        })
    }
    // 改变页码大小
    handlePageSizeChange=(page, size)=>{
    }
    handleChange=(e)=>{
        this.setState({
            name: e.target.value
        })
    }
    handleSearch=(e)=>{
        this.setState({
            name: e
        }, ()=>{
            this.getData(this.state.name)
        })
    }
    // 拉取数据
    getData = (flowName)=> {
        
        GetFormListInfo(flowName,this.state.curPage, this.state.pageSize)
        .then(res=>{
            res.data.getMe.forEach((item,index)=>{
                item.index = index + 1
                item.created = item.created === "" ? "" : moment(item.created).format("YYYY-MM-DD HH:mm:ss")
                item.lastUpdated = item.lastUpdated === "" ? "" :moment(item.lastUpdated).format("YYYY-MM-DD HH:mm:ss")
            })
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
                this.getData(this.state.name)
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
    // 删除流程（逻辑删除）
    handleOk=()=>{
        DeleteFormLogic('', this.state.formId)
        .then((res)=>{
            if(res.data.statusCode === "0000") {
                message.success("删除成功")
                this.setState({
                    visible: false
                })
                this.getData(this.state.name)
            } else {
                message.success(res.data.errMsg)
            }
        })
    }
    // 取消按钮
    handleCancel=()=>{
        this.setState({
            visible: false
        })
    }
    // 创建流程按钮
    handleCreateProcessName=(e)=>{
        this.setState({
            processName: e.target.value
        })
    }
    // 处理流程标识
    handleCreateProcessKey=(e)=>{
        this.setState({
            processKey: e.target.value
        })
    }
    // 处理流程描述
    handleCreateProcessDesc=(e)=>{
        this.setState({
            processDesc: e.target.value
        })
    }
    // 打开对话框
    openModal=()=>{
        this.props.history.push({
            pathname: '/form-render/new'
        })
    }
    // 编辑流程
    goEdit=(id,name,key,desc)=>{
        return ()=>{
            this.props.history.push({
                pathname: '/form-render/edit',
                state:{
                    id: id,
                    name: name,
                    key: key,
                    desc: desc
                }
            })
        }
    }
    // 查看流程
    goShow=(id, name)=>{
        // console.log(id)
        return ()=>{
            this.props.history.push({
                pathname: '/form-render/show',
                state:{
                    id: id,
                    name: name,
                    searchName: this.state.name
                }
            })
        }
    }
    // 跳转到台账
    goShowAccount=(name, key, id, type)=>{
        return ()=>{
            this.props.history.push({                              
                pathname: '/form-render/trans',
                state:{
                    name: name,
                    searchName: this.state.name,
                    key: key,
                    id: id,
                    type: type
                }
            })
        }
    }
    queryDataFromWeb4=()=>{
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
            if (item.indexOf("loginName") > -1) {
                // setUserName(decodeURI(item.split("=")[1]))
                this.LoginToFlowable(item.split("=")[1])
            }
        })
    }

    // 登录到Flowable
    LoginToFlowable = (loginName)=>{
        let obj = reactCookie.loadAll()
        if (obj.FLOWABLE_REMEMBER_ME && obj.FLOWABLE_REMEMBER_ME !== 'undefined') {
            return
        }
        const myData = {
            _spring_security_remember_me:true,
            j_password:"test",
            j_username: loginName,
            submit:"Login"
        }
        flowableLogin(myData)
        .then((res)=>{
            if (res.data.indexOf('FLOWABLE_REMEMBER_ME') < 0) {
                message.error("流程引擎服务不可用，请联系管理员")
                return
            }
            let resArr = res.data.split(';')
            let cookieKeyVal = resArr[0]
            let cookieArr = cookieKeyVal.split('=')
            reactCookie.save(
                cookieArr[0],
                cookieArr[1],
                { 
                    path: '/',
                    expires: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)
                }
            )
        })
    }
    componentDidMount() {
        this.queryDataFromWeb4()
        this.computeHeight()
        let flowName = this.state.name
        if (this.props.location.state) {
            flowName = this.props.location.state.searchName
            this.setState({
                name: flowName
            })
        }
        this.getData(flowName)
    }
    computeHeight(){
        var height = document.documentElement.clientHeight;
        this.setState({
            clientHeight: height - 190
        })
    }
    render() {
        return(
            <div className="modeler-wrapper">
                {/* <Modeler></Modeler> */}
                <div className="form-headerbox">
                    <Form layout="inline">
                        <Form.Item label="表单名称">
                            {/* <Input placeholder="请输入表单名称" className="input-text-content" allowClear onChange={this.handleProName}/> */}
                            <Search placeholder="请输入表单名称" value={this.state.name} allowClear className="input-text-content" onChange={this.handleChange} onSearch={this.handleSearch} style={{ width: 200 }} />
                        </Form.Item>
                        {/* <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.getData}>查询</Button>
                        </Form.Item> */}
                        {/* <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.openModal}>新增</Button>
                        </Form.Item> */}
                    </Form>
                    <Button className="localBtnClass rightBtn" size="small" type="primary" onClick={this.openModal}>新增</Button>
                </div>
                
                <div className="header-content-divider"></div>
                {
                    this.state.tableData.length > 0 ?
                    <>
                        <Table bordered={true} dataSource={this.state.tableData} pagination={false} rowClassName="rowClassName" scroll={{y: this.state.clientHeight}}>
                            <Column title="序号" dataIndex="index" key="index" width={80} align="center"/>
                            <Column title="表单名称" dataIndex="name" key="WorkflowName" align="center"/>
                            <Column title="表单标识" dataIndex="key" key="Key" align="center"/>
                            <Column title="创建人" dataIndex="createdBy" key="createdBy" align="center"/>
                            <Column title="创建时间" dataIndex="created" key="created" align="center"/>
                            <Column title="最后修改时间" dataIndex="lastUpdated" key="lastUpdated" align="center"/>
                            <Column
                                align="center"
                                title="操作"
                                key="action"
                                width={250}
                                render={(text, record) => (
                                    <Space size="middle">
                                        {
                                            record.Type === '表单' ?
                                            <div>
                                                <Button className="table-oper-btn" size="small" type="primary" style={{marginRight:"10px"}} onClick={this.goEdit(record.id, record.name, record.key, record.description)}>编辑</Button>
                                                <Button className="table-oper-btn" size="small" type="primary" style={{marginRight:"10px"}} onClick={this.delForm(record.id, record.name)}>删除</Button>
                                                <Button className="table-oper-btn" size="small" type="primary" onClick={this.goShow(record.id, record.name)}>查看</Button>
                                            </div>
                                            :
                                            <div>
                                                <Button className="table-oper-btn" size="small" type="primary" style={{marginRight:"10px"}} onClick={this.delForm(record.id)}>删除</Button>
                                                <Button className="table-oper-btn" size="small" type="primary" onClick={this.goShowAccount(record.TableName, record.key, record.id, record.IsUpdateOrAdd)}>查看</Button>
                                            </div>
                                        }
                                    </Space>
                                )}
                            />
                        </Table>
                        <Pagination
                            size="small"
                            current={this.state.curPage}
                            total={this.state.total}
                            showSizeChanger
                            showQuickJumper
                            defaultPageSize={20}
                            onChange = {this.handlePageChange}
                            showTotal={total => `共${Math.ceil(total/this.state.pageSize)}页/${total}条记录`}>
                        </Pagination>
                    </>
                    :
                    <NoData></NoData>                
                }
                
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
                
            </div>
        )
    }
}

export default Process