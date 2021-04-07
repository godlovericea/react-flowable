// 编辑form render表单
import React from 'react';
import Generator from 'fr-generator';
import { GetFormJson, UpdateFormDef } from '../../apis/process'
import {Modal, Form, Input, message} from 'antd'
import file from '../../components/UploadFile/UploadFile'

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

class EditForm extends React.Component{
    constructor(props){
        super(props);
        // 表单编辑器的ref
        this.genRef = React.createRef();
        // 表单名称
        this.formNameRef = React.createRef();
        // 表单的key标识
        this.formKeyRef = React.createRef();
        // 表单的描述
        this.formDescRef = React.createRef();

        this.state = {
            isModalVisible: false, // 保存表单的Modal
            defaultValue: {},// 表单编辑器的默认值
            templates: [] // 模板
        }
        // 配置自定义button
        this.extraButtons = [
            true, true, false, true, 
            { 
                text: '确定修改',
                type: 'primary',
                onClick: () => this.handleScheam()
            },
            { 
                text: '返回列表',
                type: 'primary',
                onClick: () => this.goBackToHome()
            }
        ]
    }
    componentDidMount(){
        this.getData()
    }
    getData =()=>{
        const id = this.props.location.state.id
        GetFormJson(id)
          .then((res)=>{
              if (res.status === 200) {
                  this.setState({
                    defaultValue: JSON.parse(res.data)
                  })
              }
          })
    }
    // 确定修改
    handleScheam = ()=>{
      this.handleOk()
    }
    // 取消修改
    handleCancel= ()=>{
        this.setState({
            isModalVisible: false
        })
    }
    // 返回列表
    goBackToHome=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    // 判断表单中是否有重复名称的字段
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
    handleOk=()=>{
        // Generator的值
        const FormInfo = this.genRef.current && this.genRef.current.getValue()
        let {properties} = FormInfo.schema
        const params = {
            FormInfo: JSON.stringify(FormInfo),
            description:this.props.location.state.desc,
            key: this.props.location.state.key,
            modelType:2,
            name: this.props.location.state.name,
            BaseTypeList: this.hanldeDeepObject(properties)
        }
        if(!params.BaseTypeList){
            message.error("您提交的表单组件不可有重名，请检查！")
            return false
        }
        UpdateFormDef(this.props.location.state.id, params)
        .then(res=>{
            alert("修改成功")
        })
    }
    render(){
        return(
            <div style={{ height: '100vh' }}>
                <Generator widgets={{ file }} ref={this.genRef} defaultValue={this.state.defaultValue} templates={templates} extraButtons={this.extraButtons}/>
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

export default EditForm;