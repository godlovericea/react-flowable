import React, { Component } from 'react'
import { getTableName, getSelectName } from '../../apis/process'
import FormTransfer from '../../libs/transform/transform'
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import './transform.less'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import SearchSelect from '../../components/SearchSelect/SearchSelect'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'

import FormRenderTrans from '../../components/FormRenderTrans/FormRenderTrans'

export default class Transform extends Component {
    constructor(props){
        super(props)
        this.formRef = React.createRef()
        this.state={
            schema: {},
            formData: {}
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = ()=>{
        const tableName = this.props.location.state.name
        getTableName(tableName)
        .then(async(res)=>{
            const dataArr = res.data.getMe[0].Groups
            let formTransfer = new FormTransfer(dataArr)
            let schema =await formTransfer.handleGroup()
            this.setState({
                schema: schema
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
        const {formData} = this.state
        return (
            <div className="transform-wrapper">
                <FormRender
                    ref={this.formRef}
                    {...formData}
                    {...this.state.schema}
                    onChange={this.setFormData}
                    widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file: UploadFile, editSearch: EditbleSelct }}
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
