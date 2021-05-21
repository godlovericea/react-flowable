// 事件发起页面
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import EventSchema from '../../libs/eventSchema/eventSchema'
import ConfigSchemaClass from '../../libs/configSchema/configSchema'
import { GetStartForm, WorkflowStart, getTableName, GetEvent, CreateEvent } from '../../apis/process'
import "./EventStartForm.less"
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


const StartForm = (props) => {
    // FormRender的formData
    const [formData, setFormData] = useState({})
    // FormRender的 schema
    const [schema, setSchema] = useState({})
    // 表单的key
    const [FormKey, setFormKey] = useState('')
    // 表单的id
    const [formId, setFormId] = useState('')
    // formRender 校验 数组
    const [valid, setValid] = useState([])
    // schema的配置文件，需要每次传递保存
    const [configSchema, setConfigSchema] = useState('')
    // form render 的ref
    const formRef = useRef();
    // 当前事件表得表名称
    const [tableName, setTableName] = useState('')
    // EventCode当前事件得事件编号
    const [eventCode, setEventCode] = useState('')

    // 校验提交表单
    const onValidate=(valid)=>{
        setValid(valid)
    }

    // 拉取事件表单
    const getStartData = ()=>{
        GetEvent(props.location.state.name)
        .then((res)=>{
            let response = res.data.getMe[0]
            setTableName(response.EventTable)
            setEventCode(response.EventCode)
            setSchema({...JSON.parse(response.EventJson),column: 3,labelWidth: 120})
        })
    }

    const handleFormRenderBaseType = (formData, configSchema)=>{
        let arr = []
        const { properties } = JSON.parse(configSchema).schema
        for (const key in properties) {
            for(const fkey in formData) {
                if (key === fkey) {
                    for(const ckey in properties[key].properties){
                        for(const cfkey in formData[fkey]) {
                            if (ckey === cfkey) {
                                arr.push({
                                    Type: properties[key].properties[ckey].type,
                                    Name: properties[key].properties[ckey].title,
                                    Value: formData[fkey][cfkey]
                                })
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }

    useEffect(()=>{
        getStartData()
    },[])

    // 提交
    const handleSubmit = () => {
        if (valid.length > 0) {
            message.error("提交失败,请按照提示填写表单！")
            return
        }
        // 事件名称
        let evName = props.location.state.name
        // 当前用户名称
        let userName = props.location.state.userName || '王万里'
        
        let BaseTypeList = handleFormRenderBaseType(formData, JSON.stringify(schema));

        let evSchema = new EventSchema(JSON.stringify(schema), BaseTypeList)

        CreateEvent(evName, tableName, JSON.stringify(evSchema.schema), '', userName, BaseTypeList)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("事件发起成功")
            } else {
                message.error(res.data.errMsg)
            }
        })
    };
    // 重置按钮
    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
            alert(JSON.stringify(res, null, 2));
        });
    };
    // 返回
    const handleGoBack=()=>{
        props.history.push({
            pathname: '/form-render/eventstart',
            state:{
                loginName: props.location.state.loginName,
            }
        })
    }

    return (
        <div className="startwrap">
            <div className="form-info-box">
                <div className="form-info-before"></div>
                <div>{props.location.state.name}</div>
            </div>
            <div className="header-content-divider"></div>
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, 
                    editSearch: EditbleSelct, mapSelect: AMapContainer,cityPicker: cityPicker,multiSelect: multiSelect, 
                    DateTimePicker:DateTimePicker, CodeGenerator:CodeGenerator }}
            />
            <div className="btngroups">
                <Button type="primary" style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleSubmit}>发起</Button>
                <Button style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleClick}>重置</Button>
                <Button style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleGoBack}>返回</Button>
            </div>
        </div>
    );
};

export default StartForm;