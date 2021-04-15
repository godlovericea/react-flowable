// 给事件配置流程
import React from 'react'
import { Button, Input, Form, Row, Col, Checkbox, message, Modal, Radio } from 'antd';
import { GetWorkflowBaseInfo, SaveEventConfig, GetEvent } from '../../apis/process';
import { ToolFilled } from '@ant-design/icons';
import StaffSelect from '../../components/StaffSelect/StaffSelect';
import './EventConfig.less'
class EventConfig extends React.Component {
    state={
        eventName: '',
        userName: '',// 用户名
        flowName: '',// 流程名称
        flowArr: [],// 流程数组
        defaultVal: [],// 默认值
        keyList: [], // 流程key数组
        visible: false, // Modal
        EndType: "0", // 流程结束标志
        curFlowId: '',
        configedFlowArr: [], // 已经配置过的流程数组
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
        // console.log(this.props.location.state.name)
        let arr =[]
        GetWorkflowBaseInfo('', '', '', '', 1, 1000)
        .then((res)=>{
            // 处理获取AccessRight为1的，有权限的值
            res.data.getMe.forEach((item)=>{
                arr.push({
                    label: item.WorkflowName,
                    value: item.Key,
                    id: item.ID,
                    EndType: "0"
                })
            })
            GetEvent(this.props.location.state.name)
            .then((response)=>{
                let dataArr = response.data.getMe[0].FlowInfoList
                arr.forEach((item)=>{
                    dataArr.forEach((cItem)=>{
                        if (item.value === cItem.FlowName) {
                            item.checked = true
                        }
                    })
                })
                this.setState({
                    flowArr: arr,
                    eventName: this.props.location.state.name
                })
            })
        })
    }
    // 保存流程结束之后的事件
    saveEndType=()=>{
        // console.log(this.state.flowArr)
        // console.log(this.state.EndType)
        let arr = []
        console.log(this.state.flowArr, "flowArr")
        this.state.flowArr.forEach((item)=>{
            if (item.id === this.state.curFlowId) {
                arr.push({
                    label: item.label,
                    value: item.value,
                    checked:item.checked,
                    id: item.id,
                    EndType: this.state.EndType
                })
            } else {
                arr.push(item)
            }
        })
        console.log(arr, "arr")
        this.setState({
            flowArr: arr,
            configedFlowArr: arr,
            visible: false
        })
    }
    // 
    handleChangeSelect=(e)=>{
        this.setState({
            EndType: e.target.value
        });
    }
    // 打开Modal
    openModal=(id)=>{
        return ()=> {
            this.setState({
                visible: true,
                curFlowId: id
            })
        }
    }
    // 关闭Modal
    closeModal=()=>{
        this.setState({
            visible: false,
        })
    }
    // 把流程挂接到某人身上，分配流程发起的权限
    linkToEvent=()=>{
        let keyList = []
        this.state.configedFlowArr.forEach((item)=>{
            if (item.checked) {
                keyList.push({
                    EventName: this.state.eventName,
                    FlowName: item.value,
                    EndType: item.EndType
                })
            }
        })
        if (keyList.length === 0) {
            message.error("请配置流程");
            return
        }
        SaveEventConfig(this.state.eventName, keyList)
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
        // this.handleRouteParams()
        this.getData()
    }
    render(){
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        }
        return (
            <div className="EventConfig-wrapper">
                <div className="EventConfigform-headerbox">
                    <Form layout="inline">
                        <Form.Item label="人员选择">
                            <StaffSelect handleStaff={this.handleStaff}></StaffSelect>
                        </Form.Item>
                        <Form.Item label="流程名称">
                            <Input type="text" placeholder="请输入流程名称" size="small" allowClear onChange={this.getInput}></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" shape="round" onClick={this.getData}>查询</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button className="localBtnClass" size="small" type="primary" shape="round" onClick={this.linkToEvent}>挂接</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="EventConfig-contentbox">
                    <Row gutter={[20, 20]}>
                        {
                            this.state.flowArr.map((item,index)=>{
                                return(
                                    <Col span={4} key={index} className="colstyle">
                                        <Checkbox value={item.value} checked={item.checked} onChange={this.onChange} className="lableclass">{item.label}</Checkbox>
                                        {
                                            item.checked ?
                                            <ToolFilled title="点击配置流程结束之后事项" className="set-form-class" onClick={this.openModal(item.id)}/>
                                            :
                                            null
                                        }
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
                <Modal title="流程结束之后" visible={this.state.visible} onOk={this.saveEndType} onCancel={this.closeModal}>
                    <Radio.Group onChange={this.handleChangeSelect} value={this.state.EndType}>
                        <Radio style={radioStyle} value="0">
                            不做任何事情
                        </Radio>
                        <Radio style={radioStyle} value="1">
                            直接关闭事件
                        </Radio>
                        <Radio style={radioStyle} value="2">
                            事件转为待审核
                        </Radio>
                        <Radio style={radioStyle} value="3">
                            重新处理事件
                        </Radio>
                    </Radio.Group>
                </Modal>
            </div>
        )
    }
}

export default EventConfig
