// 新增表单
import React from 'react';
// 表单生成器（可视化）
import Generator from 'fr-generator';
// import Generator from '../../libs/frGenerator';
import { CreateModel, getSelectName } from '../../apis/process'
import {Modal, Form, Input, message} from 'antd'
import './NewForm.less'

// 默认配置
const defaultValue = {
    schema: {
      type: 'object',
      properties: {
        inputName: {
          title: '简单输入框',
          type: 'string',
        },
      },
    },
    displayType: 'row',
    showDescIcon: true,
    labelWidth: 120,
  };
  // 默认模板
const templates = [
  {
    text: '模板1',
    name: 'something',
    schema: {
      title: '对象',
      description: '这是一个对象类型',
      type: 'object',
      properties: {
        inputName: {
          title: '简单输入框',
          type: 'string',
        },
        selectName: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        dateName: {
          title: '时间选择',
          type: 'string',
          format: 'date',
        },
      },
    },
  },
];

class NewForm extends React.Component{
    constructor(props){
        super(props);
        // Generator组件的ref
        this.genRef = React.createRef();
        // 表单名称的ref
        this.formNameRef = React.createRef();
        // 表单标识的ref
        this.formKeyRef = React.createRef();
        // 表单描述的ref
        this.formDescRef = React.createRef();

        this.state = {
            isModalVisible: false,
            defaultValue: {},
            templates: []
        }
        // 配置生成器的表头按钮
        this.extraButtons = [
            true, true, true, true, 
            { 
                text: '保存',
                type: 'primary',
                onClick: () => this.handleScheam() // 自定义保存
            },
            { 
                text: '返回列表',
                onClick: () => this.goBackToList() // 自定义返回列表按钮
            },
        ]
    }
    // 自定义保存
    handleScheam = ()=>{
        const FormInfo = this.genRef.current && this.genRef.current.getValue()
        // 判断用户是否使用布局组件Object包围子组件
        let flag = this.handleObject(FormInfo)
        if (!flag) {
            // message.error("请使用布局组件Object包围子组件！")
            return
        }
        this.setState({
            isModalVisible: true
        })
    }
    // 自定义返回列表按钮
    goBackToList=()=>{
        this.props.history.push({
            pathname: '/form-render/home'
        })
    }
    // 取消
    handleCancel= ()=>{
        this.setState({
            isModalVisible: false
        })
    }
    // 判断是否是分组类型的表单——>格式保持与台账一致
    handleObject=(formData)=>{
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
    // 遍历生成的schema
    hanldeDeepObject = (properties) => {
        let BaseTypeList = []
        for(let key in properties) {
            if (properties[key].hasOwnProperty('properties')) {
                for(let childkey in properties[key].properties) {
                    let objType = properties[key].properties[childkey].type
                    if (properties[key].properties[childkey].hasOwnProperty("format")) {
                        if (properties[key].properties[childkey].format === "date" || properties[key].properties[childkey].format === "dateTime") {
                            objType = "dateTime"
                        }
                    }
                    BaseTypeList.push({
                        Name:properties[key].properties[childkey].title,
                        Type: objType
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
                    Type: outType
                })
            }
        }
        // 拿schema属性得title，映射成数组
        const names = BaseTypeList.map((items)=> items.Name)
        // 将上述数组用set去重
        const nameSet = new Set(names);
        // 判断表单里边定义的字段是否有重复（由于数据库存储限制，不可重名）
        if (names.length === nameSet.size) {
            return BaseTypeList
        } else {
            message.error("您提交的表单组件不可有重名，请检查！")
            return false
        }
    }

    // 处理schema表单读取数据字典
    handleFormInfoApi = async(FormInfo) => {
        let obj = {...FormInfo}
        const {schema} = obj
        const {properties} = schema
        for(let key in properties) {
            for(let cKey in properties[key].properties) {
                if (properties[key].properties[cKey].hasOwnProperty("api") && properties[key].properties[cKey].api) {
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
    // 保存表单
    handleOk=async()=>{
        // 获取表单生成器得值
        const FormInfo = this.genRef.current && this.genRef.current.getValue()

        let handledData = await this.handleFormInfoApi(FormInfo)

        // 判断用户是否使用布局组件Object包围子组件
        // 拿cookie
        var cookies = document.cookie
        // 处理cookie
        var arr = cookies.split(";")
        var cookieKeyVal = ""
        arr.forEach(item=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > 0) {
                cookieKeyVal  = item
            }
        })
        var cookie = cookieKeyVal.split("=")[1]

        // console.log(this.formNameRef.current.state.value)

        if (!this.formNameRef.current.state.value) {
            alert("表单名称必填")
            return false
        }
        let {properties} = handledData.schema
        const params = {
            FormInfo: JSON.stringify(handledData),
            description:this.formDescRef.current.state.value,
            key:this.formKeyRef.current.state.value,
            modelType:2,
            name: this.formNameRef.current.state.value,
            BaseTypeList: this.hanldeDeepObject(properties) // 校验是否有重名
        }
        if(!params.BaseTypeList){
            message.error("您提交的表单组件不可有重名，请检查！")
            return false
        }
        CreateModel(cookie,params)
        .then(res=>{
            message.success("新增成功")
            this.setState({
                isModalVisible: false
            }, ()=>{
                this.goBackToList()
            })
        })
    }
    render(){
        return(
            <div style={{ height: '100vh' }}>
                <Generator ref={this.genRef} defaultValue={defaultValue} templates={templates} extraButtons={this.extraButtons}/>
                <Modal title="保存表单" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form layout={"horizontal"}>
                        <Form.Item label="表单名称">
                            <Input ref={this.formNameRef} placeholder="请输入表单名称" />
                        </Form.Item>
                        <Form.Item label="表单标识">
                            <Input ref={this.formKeyRef} placeholder="请输入表单标识" />
                        </Form.Item>
                        <Form.Item label="表单备注">
                            <Input ref={this.formDescRef} placeholder="请输入表单备注" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default NewForm;
