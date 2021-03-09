// 自定义Form Render组件
import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Form, Row, Col, Checkbox, message } from 'antd';
import { getUserListForRole, GetWorkflowBaseInfo, UpdateWorkFlowRight } from '../../apis/process';
import StaffSelect from '../../components/StaffSelect/StaffSelect';
import './FlowPermission.less';
const { Search } = Input;

const FlowPermission =()=> {
    const [flowArr, setFlowArr] = useState([])
    const [userName, setUserName] = useState('')
    const [keyList, setKeyList] = useState([])
    const [defaultVal, setDefaultVal] = useState([])
    const [valList, setValList] = useState([])
    const flowRef = useRef()

    const handleStaff=async (val)=>{
        await setUserName(val)
    }
    
    const onChange=(val)=>{
        // setValList(val)
        console.log(val)
    }
    
    const getData=()=>{
        let arr =[]
        let deArr = []
        let name = flowRef.current.state.value || ''
        GetWorkflowBaseInfo(name, '王万里', '', '', 1, 1000)
        .then((res)=>{
            res.data.getMe.forEach((item)=>{
                arr.push({
                    label: item.WorkflowName,
                    value: item.Key
                })
                if (item.AccessRight === '1') {
                    deArr.push(item.Key)
                }
            })
            console.log(userName)
            console.log(deArr)
            setFlowArr(arr)
            setDefaultVal(deArr)
        })
    }
    const linkToModeler=()=>{
        let FORMKEYLIST = keyList.toString()
        UpdateWorkFlowRight(userName, FORMKEYLIST)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("挂接成功")
                console.log(userName)
            } else {
                message.error(res.data.errMsg)
            }
        })
    }
        
    useEffect(()=>{
        getData()
    }, [])
    return (
        <div className="flowpermiss-wrapper">
            <div className="form-headerbox">
                <Form layout="inline">
                    <Form.Item label="人员选择">
                        <StaffSelect handleStaff={handleStaff}></StaffSelect>
                    </Form.Item>
                    <Form.Item label="流程名称">
                        <Input type="text" placeholder="请输入流程名称" size="small" allowClear ref={flowRef}></Input>
                    </Form.Item>
                    <Form.Item>
                        <Button className="localBtnClass" size="small" type="primary" onClick={getData}>查询</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button className="localBtnClass" size="small" type="primary" onClick={linkToModeler}>挂接</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="contentbox">
                <Checkbox.Group options={flowArr} onChange={onChange} value={valList} style={{ width: '100%' }} defaultValue={defaultVal} />
            </div>
        </div>
    )
}

export default FlowPermission
