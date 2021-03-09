// 自定义Form Render组件
import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Form, Row, Col, Checkbox, message } from 'antd';
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
        //console.log(val)
        const value = event.target.value;
        const data = this.state.flowArr;
        const updateData = data.map(item => {
            item.checked = item.checked ? true: (item.value === value) ? true: false
            return item;
        });
        this.setState({
            flowArr: updateData
        })
        // this.setState({
        //     keyList: val
        // })
    }

    getInput=(e)=>{
        this.setState({
            flowName: e.target.value
        })
    }
    
    getData=()=>{
        let arr =[]
        let deArr = []
        let name =  ''
        GetWorkflowBaseInfo(name, '王万里', '', '', 1, 1000)
        .then((res)=>{
            res.data.getMe.forEach((item)=>{
                const obj = {
                    label: item.WorkflowName,
                    value: item.Key,
                    checked: item.AccessRight === '1' ? true: false
                }
                arr.push(obj)
            })
            this.setState({
                flowArr: arr,
                // defaultVal: deArr
            })
        })
    }
    linkToModeler=()=>{
        let FORMKEYLIST = this.state.keyList.toString()
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
        const searchArr = search.split("=")
        this.setState({
            userName:decodeURI(searchArr[1])
        },()=>{
            this.getData()
        })
    }
    componentDidMount(){
        this.getData()
    }
    render(){
        console.log(this.state.flowArr)
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
                                    <Checkbox value={item.value} checked={item.checked} onChange={(value) => this.onChange(value, item)}>{item.label}</Checkbox>
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
