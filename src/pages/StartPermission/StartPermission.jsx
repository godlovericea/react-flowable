// 流程发起权限页面
import React from 'react';
import { Button, Input, Form, Row, Col, message } from 'antd';
import { GetWorkflowBaseInfo, flowableLogin } from '../../apis/process';
import './StartPermission.less';
import reactCookie from 'react-cookies'
import flowIcon from "../../assets/flow-icon.png"
import flowArrowIcon from "../../assets/flow-arrow-right.png"
import NoData from '../../components/NoData/NoData'
const { Search } = Input
class StartPermission extends React.Component {
    state={
        userName: '', // web4登录的用户名
        loginName: '', // 登录名
        flowName: '', // 流程名称
        flowArr: [], // isRight为1的流程数组 
        defaultVal: [], // 默认值
        keyList: [], // 选中的数组
        userId: '', // web4登录的用户ID
        userDepart: '' // web4登录的用户所在部门
    }
    // 处理监听选中的值
    onChange=(val)=>{
        this.setState({
            keyList: val
        })
    }
    // 获取输入框输入的值
    getInput=(e)=>{
        this.setState({
            flowName: e.target.value
        })
    }
    // 登录到Flowable
    LoginToFlowable = ()=>{
        let obj = reactCookie.loadAll()
        if (obj.FLOWABLE_REMEMBER_ME) {
            return
        }
        const myData = {
            _spring_security_remember_me:true,
            j_password:"test",
            j_username: this.state.loginName,
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
                    expires: new Date(new Date().getTime() + 7*24 * 3600 * 1000)
                }
            )
        })
    }
    // 拉取数据
    getData=(name = "")=>{
        let deArr = []
        // let name =  this.state.flowName || ''
        // GetWorkflowBaseInfo(name, '王万里', '', '', 1, 1000)
        GetWorkflowBaseInfo(name, this.state.userName, '', '', 1, 1000)
        .then((res)=>{
            res.data.getMe.forEach((item)=>{
                // AccessRight为1时，说明有此流程权限
                if (item.AccessRight === '1') {
                    deArr.push(item)
                }
            })
            this.setState({
                flowArr: deArr
            })
        })
    }
    // 处理从web4的路由传递过来的参数
    handleRouteParams=()=>{
        // 用户ID
        let userId = ""
        // 用户名
        let userName = ""
        // 用户部门
        let userDepart = ""
        let loginName = ""
        // 路由的search
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
            } else if (item.indexOf("userName") > -1) {
                userName = decodeURI(item.split("=")[1])
            } else if (item.indexOf("userDepart") > -1) {
                userDepart = decodeURI(item.split("=")[1])
            } else if (item.indexOf("loginName") > -1) {
                loginName = item.split("=")[1]
            }
        })
        this.setState({
            userId: userId,
            userName: userName,
            userDepart: userDepart,
            loginName: loginName
        },()=>{
            this.getData()
            this.LoginToFlowable()
        })
    }
    // 点击发起
    handleStart=(flowName, FlowDefID)=>{
        return ()=>{
            this.props.history.push({
                pathname: '/form-render/start',
                state:{
                    flowName: flowName,
                    FlowDefID: FlowDefID,
                    userId: this.state.userId,
                    userName: this.state.userName,
                    userDepart: this.state.userDepart
                }
            })
        }
    }
    componentDidMount(){
        this.handleRouteParams()
    }
    render(){
        return (
            <div className="flowpermiss-wrapper">
                <div className="form-headerbox">
                    <Form layout="inline">
                        <Form.Item label="流程名称">
                            {/* <Input type="text" placeholder="请输入流程名称" className="header-search" style={{padding:'2px 0'}} allowClear onChange={this.getInput}></Input> */}
                            <Search placeholder="请输入流程名称" className="input-text-content" onSearch={this.getData} style={{ width: 200 }} />
                        </Form.Item>
                        {/* <Form.Item>
                            <Button className="localBtnClass" size="small"  type="primary" onClick={this.getData}>查询</Button>
                        </Form.Item> */}
                    </Form>
                </div>
                <div className="header-content-divider"/>
                {
                    this.state.flowArr.length > 0 ?
                        <div className="contentbox">
                            <Row gutter={[20, 10]}>
                                {
                                    this.state.flowArr.map((item,index)=>{
                                        return(
                                            <Col span={6} key={index}>
                                                <div className="card-wrapper" onClick={this.handleStart(item.WorkflowName, item.FlowID)}>
                                                    <div className="left-card">
                                                        <img src={flowIcon} alt="" className="flow-icon"/>
                                                        <span>{item.WorkflowName}</span>
                                                    </div>
                                                    <div className="arrow-class">
                                                        <img src={flowArrowIcon} alt=""/>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </div>
                    :
                        <NoData></NoData>
                }
                
            </div>
        )
    }
   
}

export default StartPermission
