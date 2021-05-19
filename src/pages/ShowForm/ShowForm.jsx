// 展示表单类型
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import { GetFormJson } from '../../apis/process'
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
    const getData =()=>{
        const id = props.location.state.id
        GetFormJson(id)
        .then((res)=>{
            if (res.status === 200) {
                setSchema(JSON.parse(res.data))
            }
        })
    }
    
    useEffect(()=>{
        getData()
    },[])

    // 返回列表
    const handleClickReback = ()=>{
        props.history.push({
            pathname: '/form-render/home',
            state:{
                searchName: props.location.state.searchName
            }
        })
    }

    // 提交校验
    const onValidate=(valid)=>{
        setValid(valid)
    }

    return (
        <div style={{backgroundColor:'#ffffff'}}>
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
                    editSearch: EditbleSelct, mapSelect: AMapContainer,cityPicker: cityPicker,multiSelect: multiSelect, DateTimePicker:DateTimePicker }}
            />
            <div style={{textAlign: 'right',marginRight: '20px',padding: '30px 0'}}>
                <Button type="primary" style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleClickReback}>返回列表</Button>
            </div>
        </div>
    );
};

export default ShowForm;