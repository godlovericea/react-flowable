// 自定义Form Render组件
import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Form, Row, Col, Checkbox, message } from 'antd';
import { ToolFilled } from '@ant-design/icons';
import { getUserListForRole, GetWorkflowBaseInfo, UpdateWorkFlowRight } from '../../apis/process';
import StaffSelect from '../../components/StaffSelect/StaffSelect';
import './FlowPermission.less';
const { Search } = Input;

class FlowPermission extends React.Component {
    state={
        userName: '',
        flowName: '',
        flowArr: [],
        defaultVal: [],
        keyList: []
    }
    handleStaff=async (val)=>{
        this.setState({
            userName: val
        })
    }
    
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

    getInput=(e)=>{
        this.setState({
            flowName: e.target.value
        })
    }
    
    getData=()=>{
        console.log(this.state.userName)
        let arr =[]
        let name =  ''
        GetWorkflowBaseInfo(name, this.state.userName, '', '', 1, 1000)
        .then((res)=>{
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
    handleRouteParams=()=>{
        const search = window.location.search.slice(1)
        console.log(search)
        const searchArr = search.split("=")
        console.log(searchArr)
        this.setState({
            userName:decodeURI(searchArr[1])
        },()=>{
            console.log(this.state.userName)
            this.getData()
        })
    }
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
                    <Row gutter={[20, 10]}>
                        {
                            this.state.flowArr.map((item,index)=>{
                                return(
                                    <Col span={6} key={index}>
                                        <Checkbox value={item.value} checked={item.checked} onChange={this.onChange} className="lableclass">{item.label}</Checkbox>
                                        <ToolFilled title="点击配置表单字段" className="set-form-class" onClick={this.routeGo(item.id, item.label)}/>
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
