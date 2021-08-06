import React from 'react'
import {getSelectName} from '../../apis/process'
import { message, Select } from 'antd';
const { Option } = Select;

class Demo extends React.Component {
    state = {
        value: undefined,
        treeData: [],
        placeholderText: ''
    };

    getFirstNode=()=>{
        let firstName = ""
        let lastName = ""
        let arr = []
        if (this.props.options.firstName && this.props.options.lastName) {
            firstName = this.props.options.firstName
            lastName = this.props.options.lastName
            getSelectName(lastName)
            .then((res)=>{
                if (res.data.length > 0) {
                    arr = res.data
                    this.setState({
                        treeData: arr,
                        placeholderText: `请根据${firstName}的值，选择${lastName}`
                    })
                } else {
                    message.error("台账联动字段配置错误，请联系管理员！")
                }
            })
        } else {
            message.error("台账联动字段配置错误，请联系管理员！")
            return
        }
    }

    handleChange=(val)=> {
        this.props.onChange(this.props.name, val)
    }
    
    componentDidMount(){
        this.getFirstNode()
    }

    render() {
        return (
            <Select 
                style={{ width: '100%' }} 
                placeholder={this.state.placeholderText} 
                onChange={this.handleChange}
                defaultValue={this.props.value}
                optionLabelProp="label">
                {
                    this.state.treeData.map((item)=>{
                        return (
                            <Option value={item.NODEVALUE} key={item.NODEID}>
                                <div className="demo-option-label-item">
                                    <span role="img" aria-label="China">
                                        {`${item.NODENAME}(${item.NODEVALUE})`}
                                    </span>
                                </div>
                            </Option>
                        )
                    })   
                }
            </Select>
        );
    }
}

export default Demo