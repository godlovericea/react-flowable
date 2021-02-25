import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import { GetStartForm, WorkflowStart } from '../../apis/process'
// import schema from '../../json/schema.json';

const StartForm = () => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    // const [cookie, setCookie] = useState('')
    const [formId, setFormId] = useState('')
    // const [FlowDefID, setFlowDefID] = useState('')
    // const [name, setName] = useState('')
    // const [userId, setUserId] = useState(null)
    // const [processDefinitionId, setProcessDefinitionId] = useState('')

    const formRef = useRef();

    const getData =()=>{
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("FlowDefID") > -1) {
                // setFlowDefID(item.split("=")[1])
                // console.log(FlowDefID, "FlowDefID")
                GetStartForm(item.split("=")[1])
                    .then((res=>{
                        if (res.data.Errmsg) {
                            alert(res.data.Errmsg)
                            return
                        }
                        setFormId(res.data.FormID)
                        let resData = `${res.data.Form}`// 这里必须强转字符串，否则无法解析成对象
                        let jsonData = JSON.parse(resData)
                        setSchema(jsonData)
                    }))
            } 
            
        })
    }
    useEffect(()=>{
        getData()
    },[])
    // getData()
    // const getCookie=()=>{
    //     let winCookie = window.document.cookie
    //     let winCookieArr = winCookie.split(";")
    //     winCookieArr.forEach((item)=>{
    //         if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
    //             let itemArr = item.split("=")
    //             setCookie(itemArr[1])
    //         }
    //     })
    // }
    // getCookie()
    const handleSubmit = () => {
        // alert(JSON.stringify(formData, null, 2));
        let processDefinitionId = ""
        let name = ""
        let userId = ""
        let cookie = ""
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("processDefinitionId") > -1) {
                processDefinitionId = decodeURI(item.split("=")[1])
            } else if (item.indexOf("name") > -1) {
                name = decodeURI(item.split("=")[1])
            } else if (item.indexOf("userId") > -1) {
                userId = item.split("=")[1]
            }
        })
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookie = itemArr[1]
            }
        })
        var FormInfo=JSON.stringify({
            formId,
            values: formData
        })
        var date = new Date()
        const myData = {
            FormInfo,
            processDefinitionId,
            name: `${name} - ${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
        }
        WorkflowStart(cookie, userId, myData)
        .then((res)=>{
            console.log(res)
        })
    };

    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
        alert(JSON.stringify(res, null, 2));
        });
    };

    return (
        <div style={{ width: 400 }}>
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
            />
            <Button style={{ marginLeft: 30 }} onClick={handleClick}>
                重置
            </Button>
            <Button type="primary" onClick={handleSubmit}>
                提交
            </Button>
        </div>
    );
};

export default StartForm;