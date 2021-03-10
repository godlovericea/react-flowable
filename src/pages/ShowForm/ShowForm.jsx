import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import { GetFormJson } from '../../apis/process'

const StartForm = (props) => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    const formRef = useRef();
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

    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
        alert(JSON.stringify(res, null, 2));
        });
    };

    const handleClickReback = ()=>{
        props.history.push({
            pathname: '/home'
        })
    }

    return (
        <div>
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
            />
            <Button type="primary" style={{ marginLeft: 30 }} onClick={handleClickReback}>
                返回列表
            </Button>
        </div>
    );
};

export default StartForm;