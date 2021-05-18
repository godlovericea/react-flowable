// 编辑form render表单
import React,{useState, useRef, useEffect} from 'react';
import Generator, {
    defaultSettings,
    defaultCommonSettings,
    defaultGlobalSettings,
} from 'fr-generator';
import { GetFormJson, UpdateFormDef } from '../../apis/process'
import {Modal, Form, Input, message} from 'antd'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import LedgerAccount from '../../components/LedgerAccount/LedgerAccount'

const customizeSetting = {
    title: '自定义组件',
    widgets: [
        {
            text: '上传组件',
            name: 'uploadFile',
            schema: {
                title: '上传到服务器',
                type: 'string',
                'ui:widget': 'file',
            },
            widget: 'file',
            setting: {
                // api: { title: 'api', type: 'string' },
            },
        },
        {
            text: '人员选择器',
            name: 'StaffSelectWidget',
            schema: {
                title: '人员选择器',
                type: 'string',
                'ui:widget': 'staff',
            },
            widget: 'staff',
            setting: {},
        },
        {
            text: '台账选择器',
            name: 'TableAccount',
            schema: {
                title: '台账选择器',
                type: 'string',
                'ui:widget': 'table',
            },
            widget: 'table',
            setting: {},
        },
        {
            text: '可编辑值选择器',
            name: 'EditbleSelct',
            schema: {
                title: '可编辑值选择器',
                type: 'string',
                'ui:widget': 'editSearch',
            },
            widget: 'editSearch',
            setting: {},
        },
        {
            text: '搜索选择器',
            name: 'SearchSelect',
            schema: {
                title: '搜索选择器',
                type: 'string',
                'ui:widget': 'search',
            },
            widget: 'search',
            setting: {},
        },
        {
            text: '级联选择器',
            name: 'TreeCascader',
            schema: {
                title: '级联选择器',
                type: 'string',
                'ui:widget': 'cascader',
            },
            widget: 'cascader',
            setting: {},
        },
        {
            text: '城市选择器',
            name: 'cityPicker',
            schema: {
                title: '城市选择器',
                type: 'string',
                'ui:widget': 'cityPicker',
            },
            widget: 'cityPicker',
            setting: {},
        },
        {
            text: '坐标控件',
            name: 'mapSelect',
            schema: {
                title: '坐标控件',
                type: 'string',
                'ui:widget': 'mapSelect',
            },
            widget: 'mapSelect',
            setting: {},
        },
        {
            text: '自定义多选',
            name: 'multiSelect',
            schema: {
                title: '自定义多选',
                type: 'string',
                'ui:widget': 'multiSelect',
            },
            widget: 'multiSelect',
            setting: {},
        },
    ],
}

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
        let BaseTypeList = []
        for(let key in properties) {
            if (properties[key].hasOwnProperty('properties')) {
                for(let childkey in properties[key].properties) {
                    BaseTypeList.push({
                        Name:properties[key].properties[childkey].title,
                        Type: properties[key].properties[childkey].type
                    })
                }
            } else {
                BaseTypeList.push({
                    Name:properties[key].title,
                    Type: properties[key].type
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
    // 确定保存表单
    const handleOk=()=>{
        // Generator的值
        const FormInfo = genRef.current && genRef.current.getValue()
        if (!handleObject(FormInfo)) {
            return
        }
        let {properties} = FormInfo.schema
        const params = {
            FormInfo: JSON.stringify(FormInfo),
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
        <div style={{ height: '100vh' }}>
            <Generator 
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: LedgerAccount, file:UploadFile, editSearch: EditbleSelct,  }} 
                ref={genRef} 
                defaultValue={defaultValue} 
                templates={templates} 
                extraButtons={extraButtons}
                settings = {settings}
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
