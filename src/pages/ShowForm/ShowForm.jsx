// 展示表单类型
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import './ShowForm.less'
import { Button, message } from 'antd';
import { GetFormJson } from '../../apis/process'
import FormRenderWidgets from '../../libs/FormRenderWidgets/FormRenderWidgets'


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
            if (res.data && res.data !== '未将对象引用设置到对象的实例。') {
                setSchema(JSON.parse(res.data))
            } else {
                message.error(res.data || '系统错误，请联系管理员')
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
            <div className="showform-box">
                {/* <FormRender
                    ref={formRef}
                    {...schema}
                    formData={formData}
                    onChange={setFormData}
                    onValidate={onValidate}
                    showValidate={false}
                    widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, 
                        editSearch: EditbleSelct, mapSelect: AMapContainer,cityPicker: cityPicker,multiSelect: multiSelect, 
                        DateTimePicker:DateTimePicker, CodeGenerator:CodeGenerator }}
                /> */}
                <FormRender
                    ref={formRef}
                    {...schema}
                    formData={formData}
                    onChange={setFormData}
                    onValidate={onValidate}
                    showValidate={false}
                    widgets={FormRenderWidgets}
                />
            </div>
            <div style={{textAlign: 'right',marginRight: '20px',padding: '30px 0'}}>
                <Button type="primary" style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleClickReback}>返回列表</Button>
            </div>
        </div>
    );
};

export default ShowForm;