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
            schema: {},
            defaultValue: {
                schema: {
                    type: 'object',
                    properties: {},
                },
                displayType: "column",
                showDescIcon: false,
                column: 3,
                labelWidth: 0
            }
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
            // var data = new FormTransfer(dataArr)
            this.handleResData(dataArr)
            // this.setState({
            //     schema: data.defaultValue
            // })
        })
    }
    handleResData=(dataArr)=>{
        let key = ""
        for(let i = 0; i< dataArr.length; i++) {
            for(let j=0; j < dataArr[i].Schema.length; j++) {
                let pIndex = i
                let cIndex = j
                let formObj = dataArr[i].Schema[j]
                if (dataArr[i].Schema[j].Shape.indexOf("选择器") > -1) {
                    var asyncFunc = function(name) {
                        return new Promise(function(resolve, reject) {
                            let enumval = []
                            let enumNames = []
                            getSelectName(name)
                            .then((res)=>{
                                res.data.forEach((item)=>{
                                    enumval.push(item.NODEVALUE)
                                    enumNames.push(item.NODENAME)
                                })
                                console.log(enumval)
                                console.log(enumNames)
                                key = `selectName_${pIndex}_${cIndex}`
                                this.state.defaultValue.schema.properties[key] = {
                                    title: formObj.FieldName,
                                    type: 'string',
                                    enum: enumval,
                                    enumNames: enumNames,
                                }
                                resolve();
                            })
                        });
                    }
                     
                    var box5 = async function() {
                        var arr = dataArr[i].Schema;
                        for (let k = 0; k < arr.length; k++) {
                            if (arr[k].Shape.indexOf("选择器") > -1) {
                                const name = dataArr[i].Schema[j].FieldName
                                try{
                                    await asyncFunc(name);
                                    console.log()
                                }
                                catch{
                                    
                                }
                        
                            }
                        }
                    }
                    box5()
                } else if (dataArr[i].Schema[j].Shape.indexOf("文本") > -1) {
                    key = `inputName_${pIndex}_${cIndex}`
                    this.state.defaultValue.schema.properties[key] = {
                        title: formObj.FieldName,
                        type: formObj.Type === '数值' ? 'number' : 'string',
                    }

                } else if (dataArr[i].Schema[j].Shape.indexOf("日期") > -1) {
                    key = `date_${pIndex}_${cIndex}`
                    this.state.defaultValue.schema.properties[key] = {
                        title: formObj.FieldName,
                        type: "range",
                        format: "date"
                    }
                } else if (dataArr[i].Schema[j].Shape.indexOf("时间") > -1) {
                    key = `dateTime${pIndex}_${cIndex}`
                    this.defaultValue.schema.properties[key] = {
                        title: formObj.FieldName,
                        type: "range",
                        format: "dateTime"
                    }
                }
            }
        }
        this.setState({
            schema: this.state.defaultValue
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
