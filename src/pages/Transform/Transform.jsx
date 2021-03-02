import React, { Component } from 'react'
import { getTableName, getSelectName } from '../../apis/process'
import FormTransfer from '../../libs/transform/transform'
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import './transform.less'

export default class Transform extends Component {
    constructor(props){
        super(props)
        this.formRef = React.createRef()
        this.state={
            schema: {}
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = ()=>{
        const tableName = this.props.location.state.name
        getTableName(tableName)
        .then((res)=>{
            const dataArr = res.data.getMe[0].Groups
            this.handleGroup(dataArr)
        })
    }
    asyncFunc = async(name) =>{
        let result = await getSelectName(name)
        return result.data
    }
    hanldeSelect = async(name)=> {
        let obj = {}
        let data = await this.asyncFunc(name);
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
    handleEveryGroup= async(schemaList)=>{
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
                let formObj =await this.hanldeSelect(schemaList[i].FieldName)
                key = `selectName_${i}`
                obj[key] = formObj
            }
        }
        return obj
    }
    handleGroup= async(dataArr)=>{
        let obj = {}
        let key = ""
        for(let i = 0; i< dataArr.length; i++) {
            key = `object_${i}`
            let objData =await this.handleEveryGroup(dataArr[i].Schema)
            console.log(objData)
            obj[key] = {
                type:"object",
                title: dataArr[i].GroupName,
                properties: objData
            }
        }
        this.setState({
            schema:{
                schema:{
                    type: 'object',
                    properties: obj,
                },
                displayType: "row",
                showDescIcon: false,
                column: 3,
                labelWidth: 120
            }
        })
    }
    setFormData=(val)=>{
    }
    handleClickReback=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    render() {
        return (
            <div className="transform-wrapper">
                <FormRender
                    ref={this.formRef}
                    {...this.state.schema}
                    onChange={this.setFormData}
                />
                <div className="gobackBtn">
                    <Button type="primary" onClick={this.handleClickReback}>
                        返回列表
                    </Button>
                </div>
            </div>
        )
    }
}
