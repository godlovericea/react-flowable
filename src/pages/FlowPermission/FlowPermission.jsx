// 给用户配置流程权限
import React from 'react'
import { Button, Input, Form, Row, Col, Checkbox, message } from 'antd';
import { GetWorkflowBaseInfo, UpdateWorkFlowRight } from '../../apis/process';
import StaffSelect from '../../components/StaffSelect/StaffSelect';
import './FlowPermission.less';
class FlowPermission extends React.Component {
    state={
        userName: '',// 用户名
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
    // 拉取数据
    getData=()=>{
        // console.log(this.state.userName)
        let arr =[]
        let name =  ''
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
    // 处理web4路由传递过来的值
    handleRouteParams=()=>{
        const search = window.location.search.slice(1)
        // console.log(search)
        const searchArr = search.split("=")
        // console.log(searchArr)
        this.setState({
            userName:decodeURI(searchArr[1])
        },()=>{
            // console.log(this.state.userName)
            this.getData()
        })
    }
    // 前一个版本配置字段的默认值以及属性，此版本废弃
    routeGo=(id, label)=>{
        return ()=>{
            this.props.history.push({
                pathname: '/setform',
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
                            <Input type="text" placeholder="请输入流程名称" size="small" allowClear onChange={this.getInput}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.getData}>查询</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.linkToModeler}>挂接</Button>
                        </Form.Item>
                    </Form>
                </div>
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
            </div>
        )
    }
   
}

export default FlowPermission
