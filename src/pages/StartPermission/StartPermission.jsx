// 自定义Form Render组件
import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Form, Row, Col, Checkbox, message } from 'antd';
import { getUserListForRole, GetWorkflowBaseInfo, UpdateWorkFlowRight } from '../../apis/process';
import StaffSelect from '../../components/StaffSelect/StaffSelect';
import { PartitionOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './StartPermission.less';
import flowIcon from "../../assets/flow-icon.png"
import flowArrowIcon from "../../assets/flow-arrow-right.png"
const { Search } = Input;

class StartPermission extends React.Component {
    state={
        userName: '',
        flowName: '',
        flowArr: [],
        defaultVal: [],
        keyList: [],
        userId: ''
    }
    
    onChange=(val)=>{
        this.setState({
            keyList: val
        })
    }

    getInput=(e)=>{
        this.setState({
            flowName: e.target.value
        })
    }
    
    getData=()=>{
        let deArr = []
        let name =  this.state.flowName || ''
        // GetWorkflowBaseInfo(name, this.state.userName, '', '', 1, 1000)
        GetWorkflowBaseInfo(name, '王万里', '', '', 1, 1000)
        .then((res)=>{
            res.data.getMe.forEach((item)=>{
                if (item.AccessRight === '1') {
                    deArr.push(item)
                }
            })
            console.log(deArr)
            this.setState({
                flowArr: deArr
            })
        })
    }
    handleRouteParams=()=>{
        let userId = ""
        let userName = ''
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("userId") > -1) {
                userId = item.split("=")[1]
            } else if (item.indexOf("userName") > -1) {
                userName = decodeURI(item.split("=")[1])
            }
        })
        this.setState({
            userId: userId,
            userName: userName
        },()=>{
            this.getData()
        })
    }
    handleStart=(flowName, FlowDefID)=>{
        console.log(flowName, FlowDefID)
        debugger
        return ()=>{
            this.props.history.push({
                pathname: '/start',
                state:{
                    flowName: flowName,
                    FlowDefID: FlowDefID,
                    userId: this.state.userId
                }
            })
        }
    }
    componentDidMount(){
        // this.handleRouteParams()
        this.getData()
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
                            <Button className="localBtnClass" size="small" type="primary" onClick={this.getData}>查询</Button>
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
