import React from 'react';
import FormRender from 'form-render/lib/antd';
import {Button} from 'antd'
import { GetFormJson, GetStartForm, WorkflowStart } from '../../apis/process'
import './ShowForm.less'

class ShowForm extends React.Component{
    constructor(props){
      super(props)
      this.formRef = React.createRef()
      this.state = {
          value: null,
          schema:{},
          cookie: "",
          processDefinitionId: "",
          formId: '',
          FlowDefID: '',
          name: "",
          userId: null
      }
    }
    componentDidMount(){
        this.getData()
        this.handleCookie()
    }
    getData =()=>{
        // const id = this.props.location.state.id
        // GetFormJson(id)
        //     .then((res)=>{
        //         if (res.status === 200) {
        //             this.setState({
        //                 schema: JSON.parse(res.data)
        //             })
        //         }
        //   })
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            if (item.indexOf("FlowDefID") > -1) {
                this.setState({
                    FlowDefID: item.split("=")[1]
                },()=>{
                    GetStartForm(this.state.FlowDefID)
                    .then((res=>{
                        if (res.data.Errmsg) {
                            alert(res.data.Errmsg)
                            return
                        }
                        this.setState({
                            formId: res.data.FormID
                        })
                        let resData = `${res.data.Form}`// 这里必须强转字符串，否则无法解析成对象
                        let jsonData = JSON.parse(resData)
                        this.setState({
                            schema: jsonData
                        })
                    }))
                })
            } else if (item.indexOf("processDefinitionId") > -1) {
                this.setState({
                    processDefinitionId: item.split("=")[1]
                })
            } else if (item.indexOf("name") > -1) {
                this.setState({
                    name: item.split("=")[1]
                })
            } else if (item.indexOf("userId") > -1) {
                this.setState({
                    userId: item.split("=")[1]
                })
            }
        })
    }
    handleCookie=()=>{
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                this.setState({
                    cookie: itemArr[1]
                })
            }
        })
    }
    setFormData =() =>{
        
    }
    handleStart=()=>{
        console.log(this.formRef)
        // this.formRef.current.resetData({}).then(res => {
        //     alert(JSON.stringify(res, null, 2));
        // });
        var FormInfo=JSON.stringify({
            formId: this.state.formId,
            // values
        })
        var date = new Date()
        const myData = {
            FormInfo,
            processDefinitionId: this.state.processDefinitionId,
            name: `${this.state.name} - ${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
        }
        WorkflowStart(this.state.cookie, this.state.userId, myData)
        .then((res)=>{
            console.log(res)
        })
        // request(me._OAUrl + '/WorkflowStart?Cookie=' + cookie("FLOWABLE_REMEMBER_ME") + '&UserID=' + _config.userInfo.OID, {
        //     method: 'post',
        //     data:{
        //         FormInfo,
        //         name: `${name} - ${date.getDate()} ${date.getMonth() + 1} ${date.getFullYear()}`,
        //         processDefinitionId
        //     }
        // })
        // .then(()=>{
        //     msgUtils.alert("本次任务已完成！")
        //     $(modal).modal("hide")
        // })
    }
    handleSubmit = () => {
    // alert(JSON.stringify(formData, null, 2));
    };

    handleClick = () => {
        // formRef.current.resetData({}).then(res => {
        // alert(JSON.stringify(res, null, 2));
        // });
    };
    goBackToHome=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    render(){
        return (
            <div>
                <FormRender
                    ref={this.formRef}
                    {...this.state.schema}
                    onChange={this.setFormData}
                />
                <div className="backtohome">
                    <Button size="small" className="localBtnClass" type="primary" onClick={this.goBackToHome}>返回列表</Button>
                    <Button size="small" className="startBtnClass" type="primary" onClick={this.handleStart}>确定发起</Button>
                </div>
            </div>
        );
    }
}

export default ShowForm;