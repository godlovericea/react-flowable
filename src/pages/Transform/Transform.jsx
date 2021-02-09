import React, { Component } from 'react'
import { getAssetsList } from '../../apis/process'
import FormTransfer from '../../libs/transform/transform'
import FormRender from 'form-render/lib/antd';
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
    getData =()=>{
        getAssetsList()
        .then((res)=>{
            const dataArr = res.data.getMe[0].Groups
            var data = new FormTransfer(dataArr)
            console.log(data.defaultValue)
            this.setState({
                schema: data.defaultValue
            })
        })
    }
    setFormData=(val)=>{
        console.log(val)
    }
    render() {
        return (
            <div className="transform-wrapper">
                <FormRender
                  ref={this.formRef}
                  {...this.state.schema}
                  onChange={this.setFormData}
              />
            </div>
        )
    }
}
