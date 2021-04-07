// 查看台账表单
import React, { Component } from 'react'
import { Button, message } from 'antd';
import './transform.less'
import { UpdateFormDef, CreateModel } from '../../apis/process'
import FormRenderTrans from '../../components/FormRenderTrans/FormRenderTrans'
export default class Transform extends Component {
    constructor(props){
        super(props)
        this.formRef = React.createRef()
        this.state={
            formSchema: {},
            formData: {},
            tableName: '',
            IsUpdateOrAdd: ''
        }
    }
    componentDidMount(){
        this.getData()
    }
    // 拉取数据
    getData = ()=>{
        const IsUpdateOrAdd = this.props.location.state.type
        const tableName = this.props.location.state.name
        this.setState({
            tableName: tableName, // 台账名称
            IsUpdateOrAdd: IsUpdateOrAdd
        })
    }
    // 返回列表
    handleClickReback=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    handleSchema = (data) => {
        // console.log(schema)
        this.setState({
            formSchema: data
        },()=>{
            this.handleOk()
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
        // 台账得key
        const tableKey = this.props.location.state.key
        // Generator的值
        const FormInfo = this.state.formSchema
        let {properties} = FormInfo.schema
        const params = {
            FormInfo: JSON.stringify(FormInfo),
            description: '',
            key: tableKey,
            modelType: 2,
            name: this.state.tableName,
            BaseTypeList: this.hanldeDeepObject(properties)
        }
        if(!params.BaseTypeList){
            message.error("您提交的表单组件不可有重名，请检查！")
            return false
        }
        if (this.state.IsUpdateOrAdd === "update") {
            UpdateFormDef(this.props.location.state.id, params)
            .then(res=>{
                if (res.data.statusCode === "0000") {
                    message.success("转换成功")
                } else {
                    message.error(res.data.errMsg)
                }
            })
        } else {
            CreateModel(cookie, params)
            .then(res=>{
                if (res.data.id) {
                    message.success("新增成功")
                } else {
                    message.error("新增失败，请联系管理员")
                }
            })
        }
    }
    render() {
        return (
            <div className="transform-wrapper">
                <FormRenderTrans tableName={this.props.location.state.name} handleSchema={this.handleSchema}/>
                <div className="gobackBtn">
                    <Button type="primary" onClick={this.handleClickReback}>
                        返回列表
                    </Button>
                </div>
            </div>
        )
    }
}
