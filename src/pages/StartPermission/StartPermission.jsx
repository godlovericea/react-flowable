// 流程发起权限页面
import React from 'react';
import { Button, Input, Form, Row, Col } from 'antd';
import { GetWorkflowBaseInfo } from '../../apis/process';
import './StartPermission.less';
import flowIcon from "../../assets/flow-icon.png"
import flowArrowIcon from "../../assets/flow-arrow-right.png"
class StartPermission extends React.Component {
    state={
        userName: '', // web4登录的用户名
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
    // 拉取数据
    getData=()=>{
        let deArr = []
        let name =  this.state.flowName || ''
        GetWorkflowBaseInfo(name, '王万里', '', '', 1, 1000)
        // GetWorkflowBaseInfo(name, this.state.userName, '', '', 1, 1000)
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
            } 
        })
        this.setState({
            userId: userId,
            userName: userName,
            userDepart: userDepart
        },()=>{
            this.getData()
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
                            <Input type="text" placeholder="请输入流程名称" size="small" allowClear onChange={this.getInput}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button className="localBtnClass" size="small" shape="round" type="primary" onClick={this.getData}>查询</Button>
                        </Form.Item>
                    </Form>
                </div>
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
            </div>
        )
    }
   
}

export default StartPermission
