// 给用户配置流程权限
import React from 'react'
import { Button, Input, Form, Row, Col, Checkbox, message } from 'antd';
import { GetWorkflowBaseInfo, UpdateWorkFlowRight, flowableLogin } from '../../apis/process';
import StaffSelect from '../../components/StaffSelect/StaffSelect';
import reactCookie from 'react-cookies'
import './FlowPermission.less';
import NoData from '../../components/NoData/NoData'
const { Search } = Input;
class FlowPermission extends React.Component {
    state={
        userName: '',// 用户名
        loginName: '', // 登录名
        flowName: '',// 流程名称
        flowArr: [],// 流程数组
        defaultVal: [],// 默认值
        keyList: [] // 流程key数组
    }
    // 与StaffSelect子组件绑定事件传值交互
    handleStaff=async (val)=>{
        this.setState({
            userName: val
        })
    }
    // 获取点击选中的checkbox值
    onChange=(event)=>{
        const value = event.target.value;
        let updateData = []
        this.state.flowArr.forEach((item)=>{
            if (item.value === value) {
                item.checked = !item.checked
            }
            updateData.push(item)
        })
        console.log(updateData)
        this.setState({
            flowArr: updateData
        })
    }
    // 获取输入框的值
    getInput=(e)=>{
        this.setState({
            flowName: e.target.value
        })
    }
    // 获取输入框的值
    onSearch=(e)=>{
        this.setState({
            flowName: e
        })
    }
    // 拉取数据
    getData=(name = '')=>{
        // console.log(this.state.userName)
        let arr =[]
        GetWorkflowBaseInfo(name, this.state.userName, '', '', 1, 1000)
        .then((res)=>{
            // 处理获取AccessRight为1的，有权限的值
            res.data.getMe.forEach((item)=>{
                arr.push({
                    label: item.WorkflowName,
                    value: item.Key,
                    id: item.ID,
                    checked: item.AccessRight === "1" ? true: false
                })
            })
            this.setState({
                flowArr: arr
            })
        })
    }
    // 把流程挂接到某人身上，分配流程发起的权限
    linkToModeler=()=>{
        let keyList = []
        this.state.flowArr.forEach((item)=>{
            if (item.checked) {
                keyList.push(item.value)
            }
        })
        let FORMKEYLIST = keyList.toString()
        UpdateWorkFlowRight(this.state.userName, FORMKEYLIST)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("挂接成功")
            } else {
                message.error(res.data.errMsg)
            }
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
                    expires: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)
                }
            )
        })
    }
    // 处理web4路由传递过来的值
    handleRouteParams=()=>{
        let hashData = ""
        let searchData = ""
        let search = ""
        let loginName = ""
        let userName = ""
        if (window.location.hash) {
            hashData = window.location.hash
            searchData = hashData.split("?")
            search = searchData[1]
        } else {
            search = window.location.search.slice(1)
        }
        // console.log(search)
        const searchArr = search.split("&")
        console.log(searchArr)
        searchArr.forEach((item)=>{
            if (item.indexOf("userName") > -1) {
                userName = decodeURI(item.split("=")[1])
            } else if (item.indexOf("loginName") > -1) {
                loginName = item.split("=")[1]
            }
        })
        this.setState({
            userName:userName,
            loginName: loginName
        },()=>{
            // console.log(this.state.userName)
            this.LoginToFlowable()
            this.getData()
        })
    }
    // 前一个版本配置字段的默认值以及属性，此版本废弃
    routeGo=(id, label)=>{
        return ()=>{
            this.props.history.push({
                pathname: '/form-render/setform',
                state:{
                    id: id,
                    label: label
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
                        <Form.Item label="人员选择">
                            <StaffSelect handleStaff={this.handleStaff}></StaffSelect>
                        </Form.Item>
                        <Form.Item label="流程名称">
                            {/* <Input type="text" placeholder="请输入流程名称" className="input-text-content"  allowClear onChange={this.getInput}></Input> */}
                            <Search placeholder="请输入流程名称" className="input-text-content" onSearch={this.getData} style={{ width: 200 }} />
                        </Form.Item>
                        {/* <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.getData}>查询</Button>
                        </Form.Item> */}
                        {/* <Form.Item className="formItemBox">
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.linkToModeler}>挂接</Button>
                        </Form.Item> */}
                    </Form>
                    <Button className="localBtnClass rightBtn" size="small" type="primary" onClick={this.linkToModeler}>挂接</Button>
                </div>
                <div className="header-content-divider"/>
                {
                    this.state.flowArr.length > 0 ?
                    <div className="contentbox">
                    <Row gutter={[20, 20]}>
                        {
                            this.state.flowArr.map((item,index)=>{
                                return(
                                    <Col span={4} key={index} className="permission-contentbox" style={{overflow: 'hidden'}}>
                                        <Checkbox value={item.value} checked={item.checked} onChange={this.onChange} className="lableclass">{item.label}</Checkbox>
                                        {/* <ToolFilled title="点击配置表单字段" className="set-form-class" onClick={this.routeGo(item.id, item.label)}/> */}
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

export default FlowPermission
