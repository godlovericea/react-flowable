// 给流程配置需要显示的字段
import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Form, Row, Col, Checkbox, Tree, message } from 'antd';
import { ToolFilled } from '@ant-design/icons';
import { GetActList, SaveColumnConfig, GetColumnConfig } from '../../apis/process';
import './SetFlowForm.less';

const SetFlowForm =(props)=> {
    const [nodeFlow, SetNodeFlow] = useState([]) // 节点数组
    const [treeData, SetTreeData] = useState([]) // 节点数组
    const [keyList, setkeyList] = useState([])
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
                    let config = JSON.parse(res.data.FormJson).schema
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
                let config = JSON.parse(res.data.FormJson).schema
                setSchema(config)
                hanldleNodeForm(config)
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
        console.log('onSelect', info);
        setSelectedKeys(selectedKeys);
    };
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
                        <Button type="primary" style={{width:'100px'}} shape="round" onClick={linkToModeler}>保存</Button>      
                    </Col>
                </Row>
            </div>
            
        </div>
    )
}

export default SetFlowForm
