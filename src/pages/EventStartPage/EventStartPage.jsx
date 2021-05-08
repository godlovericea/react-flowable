// 流程发起权限页面
import React from 'react';
import { Button, Input, Form, Row, Col, message, Divider } from 'antd';
import { GetEventList, flowableLogin } from '../../apis/process';
import './EventStartPage.less';
import reactCookie from 'react-cookies'
import flowIcon from "../../assets/flow-icon.png"
import { FileDoneOutlined } from '@ant-design/icons';
import flowArrowIcon from "../../assets/flow-arrow-right.png"
class EventStartPage extends React.Component {
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
            j_username: this.state.loginName || this.props.location.state.loginName,
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
    getData=()=>{
        GetEventList('')
        .then((res)=>{
            this.setState({
                flowArr: res.data.getMe
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
        let loginName= ""
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
        // ?userId=${userId}&loginName=${loginName}&userName=${userName}" 
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
    handleStart=(name)=>{
        return ()=>{
            this.props.history.push({
                pathname: '/form-render/eventform',
                state:{
                    name: name,
                    userName: this.state.userName,
                    userId: this.state.userId,
                    loginName: this.state.loginName
                }
            })
        }
    }
    componentDidMount(){
        this.handleRouteParams()
    }
    render(){
        return (
            <div className="EventStartPage-wrapper">
                <div className="form-headerbox">
                    <Form layout="inline">
                        <Form.Item label="事件名称">
                            <Input type="text" placeholder="请输入事件名称" allowClear onChange={this.getInput}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.getData}>查询</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Divider className="header-content-divider"/>
                <div className="contentbox">
                    <Row gutter={[20, 10]}>
                        {
                            this.state.flowArr.map((item,index)=>{
                                return(
                                    <Col span={6} key={index}>
                                        <div className="card-wrapper" onClick={this.handleStart(item.EventName)}>
                                            <div className="left-card">
                                                <FileDoneOutlined className="fileiconstyle"/>
                                                <span>{item.EventName}</span>
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

export default EventStartPage
