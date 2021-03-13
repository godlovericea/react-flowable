import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import { GetStartForm, WorkflowStart, getTableName } from '../../apis/process'
import "./StartForm.less"
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'

const StartForm = (props) => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    const [FormKey, setFormKey] = useState('')
    const [formId, setFormId] = useState('')
    const [valid, setValid] = useState([])
    const [configSchema, setConfigSchema] = useState('')
    const formRef = useRef();

    const onValidate=(valid)=>{
        setValid(valid)
    }

    const getData =async()=>{
        let FlowDefID = props.location.state.FlowDefID
        let res =await GetStartForm(FlowDefID)
        
        if (res.data.Errmsg) {
            alert(res.data.Errmsg)
            return
        }
        setFormId(res.data.FormID)
        setFormKey(res.data.FormKey)
        if (res.data.Type === "台账") {
            const tableName = res.data.Form
            let response = await getTableName(tableName)
            
            const dataArr = response.data.getMe[0].Groups
            // handleGroup(dataArr)
            let formTransfer = new FormTransfer(dataArr)
            let schemadata =await formTransfer.handleGroup()
            
            setSchema(schemadata)
            setConfigSchema(JSON.stringify(schemadata))
            
        } else if (res.data.Type === "表单") {
            let resData = `${res.data.Form}`// 这里必须强转字符串，否则无法解析成对象
            setConfigSchema(resData)
            let jsonData = JSON.parse(resData)
            if (res.data.ColumnConfig) {
                let ColumnConfig = res.data.ColumnConfig
                let arr = ColumnConfig.split(',')
                let properties = jsonData.schema.properties
                let cusProperty = {}
                let childProperty = {}
                for(let key in properties){
                    for(let ckey in properties[key].properties) {
                        for(let i = 0;i< arr.length; i++) {
                            if (ckey === arr[i]) {
                                childProperty[ckey] = properties[key].properties[ckey]
                                cusProperty[key] = properties[key]
                            }
                        }
                    }
                }
                jsonData.schema.properties = cusProperty
            }
            setSchema(jsonData)
        }
        
    }
    useEffect(()=>{
        getData()
    },[])

    const handleSubmit = () => {
        if (valid.length > 0) {
            message.error("提交失败,请按照提示填写表单！")
            return
        }
        if(!formId){
            message.error("提交失败！原因：该表单未部署成功，请联系系统管理员！")
            return
        }
        let processDefinitionId = props.location.state.FlowDefID
        let flowName = props.location.state.flowName
        let userId = props.location.state.userId
        let cookie = ""
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
            Config: configSchema,
            processDefinitionId,
            name: `${flowName} - ${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
            FormKey: FormKey
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
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file:UploadFile, editSearch: EditbleSelct }}
            />
            <Button style={{ marginLeft: 30 }} onClick={handleClick}>
                重置
            </Button>
            <Button type="primary" onClick={handleSubmit}>
                发起
            </Button>
        </div>
    );
};

export default StartForm;