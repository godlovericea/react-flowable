// 给流程配置需要显示的字段（此页面废弃）
import React, { useState, useEffect } from 'react'
import { Button, Input, Form, Row, Col, Tree, message, Modal, Select } from 'antd';
import { GetActList, SaveColumnConfig, GetColumnConfig } from '../../apis/process';
import './SetFlowForm.less';

const { Option } = Select;

const SetFlowForm =(props)=> {
    const [nodeFlow, SetNodeFlow] = useState([]) // 节点数组
    const [treeData, SetTreeData] = useState([]) // 节点数组
    const [flowId, setFlowId] = useState('')
    const [schema, setSchema] = useState({})
    const [flowName, setFlowName] = useState('')
    const [clickIndex, setClickIndex] = useState(1000)

    const [actId, setActId] = useState('')
    const [formKey, setFormKey] = useState('')

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const [inputVisible, setInputVisible] = useState(false)
    const [selectVal, setSelectVal] = useState("")

    const [beenConfiged, setBeenConfiged] = useState([])
    const [curNodeKey, setCurNodeKey] = useState("")
    const [customInput, setCustomInput] = useState("")

    const onChange = (event) => {
        const value = event.target.value;
        let updateData = []
        nodeFlow.forEach((item) => {
            if (item.value === value) {
                item.checked = !item.checked
            }
            updateData.push(item)
        })
        SetNodeFlow(updateData)
    }

    const getData = () => {
        setFlowId(props.location.state.id)
        setFlowName(props.location.state.label)
        GetActList(props.location.state.id)
            .then((res) => {
                SetNodeFlow(res.data.childShapes)
                let firstNodeId = res.data.childShapes[0].resourceId
                let firstFormKey = res.data.childShapes[0].properties.formreference.key
                GetColumnConfig(firstNodeId, firstFormKey)
                .then((res)=>{
                    let resData = res.data.FormJson
                    let config = JSON.parse(resData).schema
                    console.log(config)
                    setSchema(config)
                    hanldleNodeForm(config)
                })
            })
    }
    const getNodeForm=(nodeId, index, formKey)=>{
        return ()=>{
            setClickIndex(index)
            setActId(nodeId)
            setFormKey(formKey)
            GetColumnConfig(nodeId, formKey)
            .then((res)=>{
                let resData = `${res.data.FormJson}`
                if (resData) {
                    let config = JSON.parse(resData).schema
                    setSchema(config)
                    hanldleNodeForm(config)
                }
                setCheckedKeys([]);
            })

        }
    }
    // 处理返回的表单
    const hanldleNodeForm =() => {
        const { properties } = schema
        let propertiesArr = []
        for(let key in properties) {
            const parentNode = {
                title: properties[key].title,
                key: key,
                children: handleEverGroup(properties[key])
            }
            propertiesArr.push(parentNode)
        }
        SetTreeData(propertiesArr)
    }
    // 处理每一个分组的表单
    const handleEverGroup=(itemObj)=>{
        const {properties} = itemObj
        let arr = []
        for(let key in properties) {
            arr.push({
                title: properties[key].title,
                key: key
            })
        }
        return arr
    }

    const linkToModeler = () => {
        console.log(beenConfiged)
        const keys = checkedKeys.toString()
        SaveColumnConfig(actId, formKey, keys)
        .then((res)=>{
            message.success("保存成功！")
        })
    }
    const onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.

        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        setCheckedKeys(checkedKeys);
    };

    const onSelect = (selectedKeys, info) => {
        console.log('selectedKeys', selectedKeys)
        if (selectedKeys) {
            setInputVisible(true)
            setCurNodeKey(info.node.key)
        }
        console.log('onSelect', info);
        setSelectedKeys(selectedKeys);
    };

    const hanldeOkInput=()=>{
        beenConfiged.push({
            key: curNodeKey,
            defaultValue: selectVal === "自定义值选择器" ? customInput : selectVal
        })
        setBeenConfiged(beenConfiged)
        setInputVisible(false)
    }

    const closeOnCancel=()=>{
        setInputVisible(false)
    }

    const hanldeInputChange=(e)=>{
        setCustomInput(e.target.value)
    }

    const handleChange=(val)=>{
        setSelectVal(val)
    }

    useEffect(()=>{
        getData()
        hanldleNodeForm()
    }, [])
    
    return (
        <div className="setform-wrapper">
            <div className="setform-contentheader">
                <h3>{flowName}</h3>
            </div>
            <Row>
                <Col span={8}>
                    <div className="setform-headerbox">
                        {
                            nodeFlow.map((item, index) => {
                                return (
                                    <div className="setform-itembox" style={{backgroundColor: clickIndex === index ? '#dddddd': ''}} title={item.properties.name} key={index} onClick={getNodeForm(item.resourceId, index, item.properties.formreference.key)}>
                                        节点名称：{item.properties.name}
                                    </div>
                                )
                            })
                        }
                    </div>
                </Col>
                <Col span={12}>
                    <div className="setform-contentbox">
                        <Tree
                            checkable
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                            onSelect={onSelect}
                            selectedKeys={selectedKeys}
                            treeData={treeData}
                        />
                    </div>
                </Col>
            </Row>
            <div className="bottom-btn">
                <Row>
                    <Col span={8}></Col>
                    <Col span={12}>
                        <Button type="primary" style={{width:'100px'}} className="table-oper-btn" onClick={linkToModeler}>保存</Button> 
                    </Col>
                </Row>
            </div>
            
            <Modal title="请配置默认值" visible={inputVisible} onOk={hanldeOkInput} onCancel={closeOnCancel}>
                <Form layout="vertical" >
                    <Form.Item label="选择属性">
                        <Select style={{ width: '100%' }} onChange={handleChange} allowClear value={selectVal}>
                            <Option value="本人姓名">本人姓名</Option>
                            <Option value="本人部门">本人部门</Option>
                            <Option value="自定义值选择器">自定义值选择器</Option>
                        </Select>
                    </Form.Item>
                    {
                        selectVal === '自定义值选择器' ?
                        <Form.Item label="自定义值选择器">
                            <Input type="text" placeholder="请以逗号分隔" onChange={hanldeInputChange}></Input>
                        </Form.Item>
                        :
                        null
                    }
                    
                </Form>
            </Modal>
        </div>
    )
}

export default SetFlowForm
