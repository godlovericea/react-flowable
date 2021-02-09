import React from 'react';
import Generator from 'fr-generator';
import { CreateModel,GetFormJson } from '../../apis/process'
import {Modal, Form, Input, Button} from 'antd'
// import FormTransfer from '../../libs/transform/transform'


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
        this.genRef = React.createRef();
        this.formNameRef = React.createRef();
        this.formKeyRef = React.createRef();
        this.formDescRef = React.createRef();
        this.state = {
            isModalVisible: false,
            defaultValue: {},
            templates: []
        }
        this.extraButtons = [
            true, true, false, true, 
            { 
                text: '保存',
                type: 'primary',
                onClick: () => this.handleScheam()
            },
            { 
                text: '返回列表',
                onClick: () => this.goBackToList()
            },
        ]
    }
    handleScheam = ()=>{
        this.setState({
            isModalVisible: true
        })
    }
    goBackToList=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    handleCancel= ()=>{
        this.setState({
            isModalVisible: false
        })
    }
    handleOk=()=>{
        const FormInfo = this.genRef.current && this.genRef.current.getValue()
        var cookies = document.cookie
        var arr = cookies.split(";")
        var cookieKeyVal = ""
        arr.forEach(item=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > 0) {
                cookieKeyVal  = item
            }
        })
        var cookie = cookieKeyVal.split("=")[1]

        console.log(this.formNameRef.current.state.value)
        if (!this.formNameRef.current.state.value) {
            alert("表单名称必填")
            return false
        }
        const params = {
            FormInfo: JSON.stringify(FormInfo),
            description:this.formDescRef.current.state.value,
            key:this.formKeyRef.current.state.value,
            modelType:2,
            name: this.formNameRef.current.state.value
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
