// 新增表单
import React from 'react';
// 表单生成器（可视化）
import Generator from 'fr-generator';
// import Generator from '../../libs/frGenerator';
import { SaveEvent } from '../../apis/process'
import {Modal, Form, Input, message} from 'antd'
import './NewEventForm.less'

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

class NewEventForm extends React.Component{
    constructor(props){
        super(props);
        // Generator组件的ref
        this.genRef = React.createRef();
        // 表单名称的ref
        this.eventNameRef = React.createRef();
        // 表单标识的ref
        this.codeRef = React.createRef();
        // 表单描述的ref
        this.tableNameRef = React.createRef();

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
        const FormInfo = this.genRef.current && this.genRef.current.getValue()
        // 判断用户是否使用布局组件Object包围子组件
        let flag = this.handleObject(FormInfo)
        if (!flag) {
            return
        }
        this.setState({
            isModalVisible: true
        })
    }
    // 自定义返回列表按钮
    goBackToList=()=>{
        this.props.history.push({
            pathname: '/eventlist'
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
        console.log(JSON.stringify(formData))
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

        if (!(this.eventNameRef.current.state.value && this.codeRef.current.state.value && this.tableNameRef.current.state.value)) {
            message.error("请完整填写事件信息")
            return false
        }
        let {properties} = FormInfo.schema
        const params = {
            EventJson: JSON.stringify(FormInfo),
            EventName: this.eventNameRef.current.state.value,
            Code:this.codeRef.current.state.value,
            TableName:this.tableNameRef.current.state.value,
            BaseTypeList: this.hanldeDeepObject(properties) // 校验是否有重名
        }
        if(!params.BaseTypeList){
            message.error("您提交的表单组件不可有重名，请检查！")
            return false
        }
        SaveEvent(params.EventJson,params.TableName,params.Code,params.EventName,params.BaseTypeList)
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
                    <Form layout={"vertical"}>
                        <Form.Item label="事件表单名称">
                            <Input ref={this.tableNameRef} placeholder="请输入事件表单名称" />
                        </Form.Item>
                        <Form.Item label="事件编号">
                            <Input ref={this.codeRef} placeholder="请输入事件编号" />
                        </Form.Item>
                        <Form.Item label="事件名称">
                            <Input ref={this.eventNameRef} placeholder="请输入事件名称" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default NewEventForm;
