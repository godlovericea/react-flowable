import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import { GetStartForm, WorkflowStart, getTableName, getSelectName } from '../../apis/process'
import "./StartForm.less"
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

    const asyncFunc = async(name) =>{
        let result = await getSelectName(name)
        return result.data
    }

    const hanldeSelect = async(name)=> {
        let obj = {}
        let data = await asyncFunc(name);
        let enumVals = []
        let enumNames = []
        data.forEach((item)=>{
            enumVals.push(item.NODEVALUE)
            enumNames.push(item.NODENAME)
        })
        obj = {
            title: name,
            type: 'string',
            enum: enumVals,
            enumNames: enumNames
        }
        return obj
    }

    const handleEveryGroup= async(schemaList)=>{
        let obj = {}
        let key = ""
        for(let i=0;i<schemaList.length;i++) {
            if (schemaList[i].Shape.indexOf("文本") > -1) {
                key = `inputName_${i}`
                obj[key] = {
                    title: schemaList[i].FieldName,
                    type: schemaList[i].Type === '数值' ? 'number' : 'string',
                }
            } else if (schemaList[i].Shape.indexOf("日期") > -1) {
                key = `date_${i}`
                obj[key] = {
                    title: schemaList[i].FieldName,
                    type: "range",
                    format: "date"
                }
            } else if (schemaList[i].Shape.indexOf("时间") > -1) {
                key = `dateTime_${i}`
                obj[key] = {
                    title: schemaList[i].FieldName,
                    type: "range",
                    format: "dateTime"
                }
            } else if (schemaList[i].Shape.indexOf("选择器") > -1) {
                let formObj =await hanldeSelect(schemaList[i].FieldName)
                key = `selectName_${i}`
                obj[key] = formObj
            }
        }
        return obj
    }

    const handleGroup= async(dataArr)=>{
        let obj = {}
        let key = ""
        for(let i = 0; i< dataArr.length; i++) {
            key = `object_${i}`
            let objData =await handleEveryGroup(dataArr[i].Schema)
            obj[key] = {
                type:"object",
                title: dataArr[i].GroupName,
                properties: objData
            }
        }
        setSchema({
            schema:{
                type: 'object',
                properties: obj
            },
            displayType: "row",
            showDescIcon: false,
            column: 3,
            labelWidth: 120
        })
    }

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
                        if (res.data.Type === "台账") {
                            const tableName = res.data.Form
                            getTableName(tableName)
                            .then((response)=>{
                                const dataArr = response.data.getMe[0].Groups
                                handleGroup(dataArr)
                            })
                        } else if (res.data.Type === "表单") {
                            let resData = `${res.data.Form}`// 这里必须强转字符串，否则无法解析成对象
                            let jsonData = JSON.parse(resData)
                            setSchema(jsonData)
                        }
                    }))
            } 
            
        })
    }
    useEffect(()=>{
        getData()
    },[])

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
            Config: JSON.stringify(schema),
            processDefinitionId,
            name: `${name} - ${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
        }
        WorkflowStart(cookie, userId, myData)
        .then((res)=>{
            message.success("提交成功")
        })
    };

    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
        alert(JSON.stringify(res, null, 2));
        });
    };

    return (
        <div className="startwrap">
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