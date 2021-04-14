// 操作在办事件详情页面

// 展示表单类型
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, Row, Col, message } from 'antd';
import { GetEvent, GetFlowIdByFlowKey, EventOperate } from '../../apis/process'
import LoginNameSelect from '../../components/LoginNameSelect/LoginNameSelect';
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import './EventOperation.less'

const EventOperation = (props) => {

    // <Modal visible={staffVisible} onOk={handleRouterGoStart} onCancel={closeModal}></Modal>
    // 人员选择器modal
    const [staffVisible, setstaffVisible] = useState(false)
    // 事件名称
    const [evName, setEvName] = useState(props.location.state.name)
    // 事件编号
    const [evCode, setEvCode] = useState(props.location.state.code)
    // 流程的ID
    const [FlowDefID, setFlowDefID] = useState('')
    // 登陆名（工号）
    const [loginName, setLoginName] = useState('')
    // 用户ID
    const [userId, setUserId] = useState('')
    // 事件挂接的流程
    const [FlowInfoList, setFlowInfoList] = useState([])
    // FormRender的formData
    const [formData, setFormData] = useState({});
    // FormRender的schema
    const [schema, setSchema] = useState({})
    // FormRender的表单提交校验
    const [valid, setValid] = useState([])
    // FormRender的组件ref
    const formRef = useRef();

    // 拉取数据
    const getData =async()=>{
        const evJson = JSON.parse(props.location.state.evJson)
        GetEvent(evName)
        .then((res)=>{
            setFlowInfoList(res.data.getMe[0].FlowInfoList)
            setSchema(evJson)
        })
    }

    const handleStaff=(loginName, userId)=>{
        setLoginName(loginName)
        setUserId(userId)
    }
    
    useEffect(()=>{
        getData()
    },[])

    // 返回列表
    const handleClickReback = ()=>{
        props.history.push({
            pathname: '/eventondeal'
        })
    }
    // 关闭事件
    const closeCurrentEvent=()=>{
        EventOperate(evName, 2, evCode)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("事件关闭成功")
            }else {
                message.error(res.data.errMsg)
            }
        })
    }
    // 打开人员选择器弹框
    const openStaffModal=(FlowName)=>{
        return ()=>{
            GetFlowIdByFlowKey(FlowName)
            .then((res)=>{
                setstaffVisible(true)
                setFlowDefID(res.data)
                props.history.push({
                    pathname: '/start',
                    state:{
                        FlowDefID: res.data,
                        loginName: loginName,
                        evCode: evCode,
                        userId: userId
                    }
                })
            })
        }
    }

    const handleRouterGoStart=()=>{
        props.history.push({
            pathname: '/start',
            state:{
                FlowDefID: FlowDefID
            }
        })
    }

    const closeModal=()=>{
        setstaffVisible(false)
    }

    // 提交校验
    const onValidate=(valid)=>{
        setValid(valid)
    }

    return (
        <div className="eventoperation-wrapper">
            <Row justify="start">
                <Col span={18}>
                    <FormRender
                        ref={formRef}
                        {...schema}
                        formData={formData}
                        onChange={setFormData}
                        onValidate={onValidate}
                        widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file:UploadFile, editSearch: EditbleSelct }}
                    />
                </Col>
                <Col span={6}>
                    <div>
                        <p className="ev-title">{evName}关联的流程</p>
                    </div>
                    <div>
                        {
                            FlowInfoList.map((item,index)=>{
                                return(
                                    <div key={index} className="flowNameList-box">
                                        <div>
                                            <span>{item.FlowName}</span>
                                        </div>
                                        <div className="flowNameList-operBox">
                                            <LoginNameSelect handleStaff={handleStaff}></LoginNameSelect>
                                            <Button type="primary" shape="round" size="small" onClick={openStaffModal(item.FlowName)}>发起</Button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Col>
            </Row>
            {/* <Modal visible={staffVisible} onOk={handleRouterGoStart} onCancel={closeModal}>
                <LoginNameSelect handleStaff={handleStaff}></LoginNameSelect>
            </Modal> */}
            <Button type="primary" style={{ marginLeft: 30 }} onClick={handleClickReback}>
                返回列表
            </Button>
            <Button type="primary" style={{ marginLeft: 30 }} onClick={closeCurrentEvent}>
                关闭事件
            </Button>
        </div>
    );
};

export default EventOperation;