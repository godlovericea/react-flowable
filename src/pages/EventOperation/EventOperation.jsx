// 操作在办事件详情页面

// 展示表单类型
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, Row, Col, message, Divider } from 'antd';
import reactCookie from 'react-cookies'
import { GetEvent, GetFlowIdByFlowKey, EventOperate, flowableLogin } from '../../apis/process'
import { FileDoneOutlined} from '@ant-design/icons';
import LoginNameSelect from '../../components/LoginNameSelect/LoginNameSelect';
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import AMapContainer from '../../components/AMapContainer/AMapContainer'
import cityPicker from '../../components/CityPicker/CityPicker'
import multiSelect from '../../components/MultiSelect/MultiSelect'
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker'
import CodeGenerator from '../../components/CodeGenerator/CodeGenerator'
import './EventOperation.less'
import FormRenderWidgets from '../../libs/FormRenderWidgets/FormRenderWidgets'

const EventOperation = (props) => {
    // 人员选择器modal
    const [staffVisible, setstaffVisible] = useState(false)
    // 事件名称
    const [evName, setEvName] = useState(props.location.state.name)
    // 事件编号
    const [evCode, setEvCode] = useState(props.location.state.code)
    const [loginName, setLoginName] = useState(props.location.state.loginName)
    // 流程的ID
    const [FlowDefID, setFlowDefID] = useState('')
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
            setUserId(props.location.state.userId)
        })
    }

    const handleStaff=(loginName, userId)=>{
        setLoginName(loginName)
        setUserId(userId)
    }

    // 登录到Flowable
    const LoginToFlowable = ()=>{
        let obj = reactCookie.loadAll()
        if (obj.FLOWABLE_REMEMBER_ME) {
            return
        }
        const myData = {
            _spring_security_remember_me:true,
            j_password:"test",
            j_username: loginName,
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
    
    useEffect(()=>{
        getData()
        LoginToFlowable()
    },[])

    // 返回列表
    const handleClickReback = ()=>{
        props.history.go(-1)
    }
    // 关闭事件
    const closeCurrentEvent=()=>{
        EventOperate(evName, 2, evCode)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("事件关闭成功")
                props.history.push({
                    pathname: '/form-render/eventondeal'
                })
            }else {
                message.error(res.data.errMsg)
            }
        })
    }
    // 打开人员选择器弹框
    const openStaffModal=(FlowName)=>{
        return ()=>{
            if (!loginName) {
                message.error("请选择流程承办人！")
                return
            }
            GetFlowIdByFlowKey(FlowName)
            .then((res)=>{
                setFlowDefID(res.data)
                props.history.push({
                    pathname: '/form-render/start',
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

    // 提交校验
    const onValidate=(valid)=>{
        setValid(valid)
    }

    return (
        <div className="eventoperation-wrapper">
            <div className="form-info-box">
                <div className="form-info-before"></div>
                <div>{props.location.state.name}</div>
            </div>
            <div className="header-content-divider"></div>
            <Row justify="start">
                <Col span={24}>
                    {/* <FormRender
                        ref={formRef}
                        {...schema}
                        formData={formData}
                        onChange={setFormData}
                        onValidate={onValidate}
                        widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, editSearch: EditbleSelct, 
                            mapSelect: AMapContainer,cityPicker: cityPicker,multiSelect: multiSelect, DateTimePicker:DateTimePicker,CodeGenerator:CodeGenerator }}
                    /> */}
                    <FormRender
                        ref={formRef}
                        {...schema}
                        formData={formData}
                        onChange={setFormData}
                        onValidate={onValidate}
                        widgets={FormRenderWidgets}
                    />
                </Col>
            </Row>
            
            <div className="linked-flow-box">
                <div className="btngroups">
                    <Button type="primary" className="table-oper-btn" style={{ marginLeft: 30 }} onClick={handleClickReback}>
                        返回列表
                    </Button>
                    <Button type="primary" className="table-oper-btn" style={{ marginLeft: 30 }} onClick={closeCurrentEvent}>
                        关闭事件
                    </Button>
                </div>
                <Divider orientation="left" plain>{evName}关联的流程</Divider>
                <Row>
                    <Col span={24} className="eventflow-box">
                        <div className="eventflow-content">
                            {
                                FlowInfoList.map((item,index)=>{
                                    return(
                                        <div key={index} className="flowNameList-box">
                                            <div className="iconwrapper">
                                                <FileDoneOutlined className="fileDoneIcon"/>
                                                <span style={{marginLeft:'10px'}}>{item.FlowName}</span>
                                            </div>
                                            <div className="flowNameList-operBox">
                                                <LoginNameSelect handleStaff={handleStaff}></LoginNameSelect>
                                                <Button type="primary" className="table-oper-btn" size="small" style={{marginLeft:"10px"}} onClick={openStaffModal(item.FlowName)}>发起</Button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default EventOperation;