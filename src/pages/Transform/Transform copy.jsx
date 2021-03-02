import React, { Component } from 'react'
import { getTableName } from '../../apis/process'
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
            var data = new FormTransfer(dataArr)
            this.setState({
                schema: data.defaultValue
            })
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
