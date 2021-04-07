// 新增表单
import React from 'react';
// 表单生成器（可视化）
import Generator from 'fr-generator';
// import Generator from '../../libs/frGenerator';
import { CreateModel } from '../../apis/process'
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
            true, true, false, true, 
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
        this.setState({
            isModalVisible: true
        })
    }
    // 自定义返回列表按钮
    goBackToList=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    // 取消
    handleCancel= ()=>{
        this.setState({
            isModalVisible: false
        })
    }
    // 遍历生成的schema
    hanldeDeepObject = (properties) => {
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
    // 保存表单
    handleOk=()=>{
        // 获取表单生成器得值
        const FormInfo = this.genRef.current && this.genRef.current.getValue()
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
        let {properties} = FormInfo.schema
        const params = {
            FormInfo: JSON.stringify(FormInfo),
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
            alert("新增成功")
            this.setState({
                isModalVisible: false
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
