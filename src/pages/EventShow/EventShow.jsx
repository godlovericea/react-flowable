// 展示表单类型
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import './EventShow.less'
import { GetFormJson, GetEvent } from '../../apis/process'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'

const ShowForm = (props) => {
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
        const name = props.location.state.name
        let result = await GetEvent(name)
        console.log(result.data.getMe[0].EventJson)
        let schema = {...JSON.parse(result.data.getMe[0].EventJson),column: 3,labelWidth: 120}
        setSchema(schema)
    }
    
    useEffect(()=>{
        getData()
    },[])

    // 返回列表
    const handleClickReback = ()=>{
        props.history.push({
            pathname: '/form-render/eventlist'
        })
    }

    // 提交校验
    const onValidate=(valid)=>{
        setValid(valid)
    }

    return (
        <div className="eventshow-wrapper">
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file:UploadFile, editSearch: EditbleSelct }}
            />
            <div className="btngroups">
                <Button type="primary" className="table-oper-btn" style={{ marginLeft: 30 }} onClick={handleClickReback}>
                    返回列表
                </Button>
            </div>
        </div>
    );
};

export default ShowForm;