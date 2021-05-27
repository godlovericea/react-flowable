// 编辑form render表单
import React,{useState, useRef, useEffect} from 'react';
import Generator, {
    defaultSettings,
    defaultCommonSettings,
    defaultGlobalSettings,
} from 'fr-generator';
import { GetFormJson, UpdateFormDef, getSelectName } from '../../apis/process'
import {Modal, Form, Input, message} from 'antd'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
// import LedgerAccount from '../../components/LedgerAccount/LedgerAccount'
import customizeSetting from '../../libs/frGeneratorConfig/frGeneratorConfig'


defaultSettings.forEach((item)=>{
    // console.log(item)
    item.widgets.forEach((cItem)=>{
        cItem.setting = {...cItem.setting,
            api:{
                title: "数据字典",
                type: 'string'
            },
            isRequired:{
                title: '必填',
                type: 'boolean'
            }
        }
    })
})

const settings = defaultSettings.push(customizeSetting)

const EditForm = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [defaultValue, setDefaultValue] = useState({})
    const [templates, setTemplates] = useState([])
    const genRef = useRef()
    const formNameRef = useRef()
    const formKeyRef = useRef()
    const formDescRef = useRef()
    
    // 配置自定义button
    const extraButtons = [
        true, true, true, true, 
        { 
            text: '确定修改',
            type: 'primary',
            onClick: () => handleScheam()
        },
        { 
            text: '返回列表',
            type: 'primary',
            onClick: () => goBackToHome()
        }
    ]
    
    useEffect(()=>{
        getData()
    }, [])
    const getData =()=>{
        const id = props.location.state.id
        GetFormJson(id)
        .then((res)=>{
            if (res.status === 200) {
                setDefaultValue(JSON.parse(res.data))
            }
        })
    }
    // 确定修改
    const handleScheam = ()=>{
        handleOk()
    }
    // 取消修改
    const handleCancel= ()=>{
        setIsModalVisible(false)
    }
    // 返回列表
    const goBackToHome=()=>{
        props.history.push({
            pathname: '/form-render/home'
        })
    }
    // 判断是否是分组类型的表单——>格式保持与台账一致
    const handleObject=(formData)=>{
        let flag = false
        // console.log(JSON.stringify(formData))
        const {properties} = formData.schema
        for (let key in properties) {
            if (!properties[key].hasOwnProperty('properties')) {
                if (key.indexOf('object') > -1) {
                    message.error("请勿使用空的分组对象！")
                } else {
                    message.error("请使用布局组件Object包围子组件！")
                }
                return false
            }
            for (let ckey in properties[key].properties) {
                // console.log(properties[key].properties[ckey].hasOwnProperty("properties"))
                // console.log(properties[key].properties[ckey].type)
                if (properties[key].properties[ckey].type === "object" || properties[key].properties[ckey].hasOwnProperty("properties")) {
                    message.error("目前仅支持2层对象嵌套，请勿使用多层！")
                    return
                } else {
                    flag = true
                }
            }
        }
        return flag
    }
    // 判断表单中是否有重复名称的字段
    const hanldeDeepObject = (properties) => {
        let BaseTypeList = [{Name: 'ProcID',Type: 'string', Code: ''}]
        for(let key in properties) {
            if (properties[key].hasOwnProperty('properties')) {
                for(let childkey in properties[key].properties) {
                    let objType = properties[key].properties[childkey].type
                    if (properties[key].properties[childkey].hasOwnProperty("format")) {
                        if (properties[key].properties[childkey].format === "date" || properties[key].properties[childkey].format === "dateTime") {
                            objType = "dateTime"
                        }
                    }
                    // console.log(properties[key].properties[childkey], "properties[key].properties[childkey]")
                    BaseTypeList.push({
                        Name:properties[key].properties[childkey].title,
                        Type: objType,
                        Code: properties[key].properties[childkey].hasOwnProperty("code") && properties[key].properties[childkey].code ? properties[key].properties[childkey].code : ""
                    })
                }
            } else {
                let outType = properties[key].type
                if (properties[key].hasOwnProperty("format")) {
                    if (properties[key].format === "date" || properties[key].format === "dateTime") {
                        outType = "dateTime"
                    }
                }
                BaseTypeList.push({
                    Name:properties[key].title,
                    Type: outType,
                    Code: properties[key].hasOwnProperty("code") && properties[key].code ? properties[key].code : ""
                })
            }
        }
        // 表单名称的数组
        const names = BaseTypeList.map((items)=> items.Name)
        // console.log(names)
        // 表单名称去重之后的数组
        const nameSet = new Set(names);
        // 如果二者相等，则没有重复的，否则有重复
        if (names.length === nameSet.size) {
            return BaseTypeList
        } else {
            message.error("您提交的表单组件不可有重名，请检查！")
            return false
        }
    }
    // 处理schema表单读取数据字典
    const handleFormInfoApi = async(dataObj) => {
        let obj = {...dataObj}
        const {schema} = obj
        const {properties} = schema
        for(let key in properties) {
            for(let cKey in properties[key].properties) {
                if (properties[key].properties[cKey].hasOwnProperty("api") && properties[key].properties[cKey].api && properties[key].properties[cKey].enum) {
                    // console.log(properties[key].properties[cKey])
                    properties[key].properties[cKey].enum = []
                    properties[key].properties[cKey].enumNames = []
                    let res =await getSelectName(properties[key].properties[cKey].api)
                    res.data.forEach((item)=>{
                        properties[key].properties[cKey].enum.push(item.NODEVALUE)
                        properties[key].properties[cKey].enumNames.push(item.NODENAME)
                    })
                }
            }
        }
        return obj
    }

    // 处理必填字段
    const handleIsRequired=(dataObj)=>{
        let obj = {...dataObj}
        const {schema} = obj
        const {properties} = schema
        for(let key in properties) {
            let required = []
            for(let cKey in properties[key].properties) {
                if (properties[key].properties[cKey].hasOwnProperty("isRequired") && properties[key].properties[cKey].isRequired) {
                    required.push(cKey)
                    properties[key].required = required
                }
            }
        }
        return obj
    }

    // 确定保存表单
    const handleOk=async()=>{
        // Generator的值
        const FormInfo = genRef.current && genRef.current.getValue()

        // console.log(FormInfo, "FormInfo")
        // 处理必填
        let requiredData = handleIsRequired(FormInfo)

        // console.log(requiredData, "requiredData")
        // 处理数据字典
        let handledData =await handleFormInfoApi(requiredData)

        // console.log(handledData, "handledData")

        if (!handleObject(handledData)) {
            return
        }
        let {properties} = handledData.schema
        const params = {
            FormInfo: JSON.stringify(handledData),
            description:props.location.state.desc,
            key: props.location.state.key,
            modelType:2,
            name: props.location.state.name,
            BaseTypeList: hanldeDeepObject(properties)
        }
        if(!params.BaseTypeList){
            message.error("您提交的表单组件不可有重名，请检查！")
            return false
        }
        UpdateFormDef(props.location.state.id, params)
        .then(res=>{
            message.success("修改成功")
            goBackToHome()
        })
    }
    return(
        <div style={{ height: '98vh' }}>
            <Generator 
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, file:UploadFile, editSearch: EditbleSelct,  }} 
                ref={genRef} 
                defaultValue={defaultValue} 
                templates={templates} 
                extraButtons={extraButtons}
                settings = {settings}
                // commonSettings={commonSettings}
            />
            <Modal title="保存表单" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form layout={"horizontal"}>
                    <Form.Item label="表单名称">
                        <Input ref={formNameRef} placeholder="请输入表单名称" />
                    </Form.Item>
                    <Form.Item label="表单标识">
                        <Input ref={formKeyRef} placeholder="请输入表单标识" />
                    </Form.Item>
                    <Form.Item label="表单备注">
                        <Input ref={formDescRef} placeholder="请输入表单备注" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
    
}

export default EditForm;
