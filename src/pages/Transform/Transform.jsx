import React, { Component } from 'react'
import { Button } from 'antd';
import './transform.less'
import FormRenderTrans from '../../components/FormRenderTrans/FormRenderTrans'
export default class Transform extends Component {
    constructor(props){
        super(props)
        this.formRef = React.createRef()
        this.state={
            schema: {},
            formData: {},
            tableName: ''
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = ()=>{
        const tableName = this.props.location.state.name
        this.setState({
            tableName: tableName
        })
    }
    
    handleClickReback=()=>{
        this.props.history.push({
            pathname: '/home'
        })
    }
    render() {
        return (
            <div className="transform-wrapper">
                <FormRenderTrans tableName={this.props.location.state.name}/>
                <div className="gobackBtn">
                    <Button type="primary" onClick={this.handleClickReback}>
                        返回列表
                    </Button>
                </div>
            </div>
        )
    }
}
