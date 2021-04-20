// 流程发起页面
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import ConfigSchemaClass from '../../libs/configSchema/configSchema'
import { GetStartForm, WorkflowStart, getTableName } from '../../apis/process'
import "./StartForm.less"
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'

const StartForm = (props) => {
    // FormRender的formData
    const [formData, setFormData] = useState({});
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

    // 校验提交表单
    const onValidate=(valid)=>{
        setValid(valid)
    }

    // 拉取数据
    const getData =async()=>{
        // 流程ID
        let FlowDefID = props.location.state.FlowDefID
        // 用户名
        let userName = props.location.state.userName
        // 用户部门
        let userDepart = props.location.state.userDepart
        // 拉取发起流程的第一个节点的表单
        let res =await GetStartForm(FlowDefID)
        
        if (res.data.Errmsg) {
            alert(res.data.Errmsg)
            return
        }
        setFormId(res.data.FormID)
        setFormKey(res.data.FormKey)

        if (res.data.Type === "台账") {
            const tableName = res.data.Form
            // 通过台账名称取查询台账字段
            let response = await getTableName(tableName)
            // 接受台账字段数组
            const dataArr = response.data.getMe[0].Groups
            // 处理台账各种字段
            let formTransfer = new FormTransfer(dataArr)
            // 由于异步，需要在外边手动调用处理方法，拿到处理结果
            let schemadata =await formTransfer.handleGroup()
            
            setSchema(schemadata)
            setConfigSchema(JSON.stringify(schemadata))
            
        } else if (res.data.Type === "表单") {
            let fieldData = res.data
            setConfigSchema(fieldData.Form)

            // web4配置文件，用户名，用户部门
            const web4Config = {
                userName: userName,
                userDepart: userDepart
            }
            // 处理表单数据
            const testData = new ConfigSchemaClass(fieldData.ColumnConfig, fieldData.Form, web4Config)
            setSchema(testData.schema)
        }
    }
    useEffect(()=>{
        getData()
    },[])

    // 提交
    const handleSubmit = () => {
        if (valid.length > 0) {
            message.error("提交失败,请按照提示填写表单！")
            return
        }
        if(!formId){
            message.error("提交失败！原因：该表单未部署成功，请联系系统管理员！")
            return
        }
        // 流程定义ID
        let processDefinitionId = props.location.state.FlowDefID

        let arr = processDefinitionId.split(":")

        // 流程名称
        let flowName = arr[0]
        // 用户ID
        let userId = props.location.state.userId
        // 事件编号
        let evCode = props.location.state.evCode || ""
        // 登录名
        let loginName = props.location.state.loginName || ""
        // flowable-engine内部鉴权使用的cookie
        let cookie = ""
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookie = itemArr[1]
            }
        })
        const dateEn = ["January","February","March","April","May","June", "July", "August", "September", "October", "November","December"]
        let monthName = ""
        const date = new Date()
        const month = date.getMonth()
        dateEn.forEach((item,index)=>{
            if (index === month) {
                monthName = item
            }
        })
        const day = date.getDate()
        const year = date.getFullYear()
        var FormInfo=JSON.stringify({
            formId,
            values: formData
        })
        const myData = {
            formId,
            FormInfo,
            Config: configSchema,
            processDefinitionId,
            name: `${flowName} - ${monthName} ${day}th ${year}`,
            FormKey: FormKey
        }
        WorkflowStart(cookie, userId, evCode, loginName, myData)
        .then((res)=>{
            message.success("提交成功")
        })
    };
    // 重置按钮
    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
            alert(JSON.stringify(res, null, 2));
        });
    };

    const handleGoBack=()=>{
        props.history.push({
            pathname: '/stpermis'
        })
    }

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
            <div className="btngroups">
                <Button type="primary" style={{ marginLeft: 30 }} shape="round" onClick={handleSubmit}>发起</Button>
                <Button style={{ marginLeft: 30 }} shape="round" onClick={handleClick}>重置</Button>
                <Button style={{ marginLeft: 30 }} shape="round" onClick={handleGoBack}>返回</Button>
            </div>
        </div>
    );
};

export default StartForm;