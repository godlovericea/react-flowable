// 展示表单类型
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import { GetFormJson } from '../../apis/process'

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
            pathname: '/home'
        })
    }

    // 提交校验
    const onValidate=(valid)=>{
        setValid(valid)
    }

    return (
        <div>
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
            />
            <Button type="primary" style={{ marginLeft: 30 }} onClick={handleClickReback}>
                返回列表
            </Button>
        </div>
    );
};

export default ShowForm;