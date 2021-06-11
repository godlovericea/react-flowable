// 自定义FormRender组件——自定义多选（数据字典）
import React from 'react'
import { Select } from 'antd';
import { getSelectName } from '../../apis/process'
import './MultiSelect.less'

const { Option } = Select;

class MultiSelect extends React.Component {

    state = {
        selectedValue: [],
        children: [],
        childrenArr: [],
        defaultValue: []
    }

    handleChange = (value) => {
        if (value.includes('全选')) {
            if (value.length === this.state.children.length) {
                this.setState({
                    selectedValue: []
                },()=>{
                    this.props.onChange(this.props.name, this.state.selectedValue)
                })
                return
            }
            let tempArr = this.state.childrenArr.slice(1)
            this.setState({
                selectedValue: tempArr
            }, ()=>{
                this.props.onChange(this.props.name, this.state.selectedValue)
            })
        } else {
            this.setState({
                selectedValue: value
            },()=>{
                this.props.onChange(this.props.name, this.state.selectedValue)
            })
        }
    }

    getData=async()=>{
        let resArr = this.props.schema.enum
        if (this.props.schema.hasOwnProperty("fieldData") && this.props.schema.fieldData) {
            let res =await getSelectName(this.props.schema.fieldData)
            resArr = res.data
        }
        let arr = ["全选"]
        let cArr = []
        for (let i = 0; i < resArr.length; i++) {
            arr.push(resArr[i].NODEVALUE)
        }
        for(let i = 0; i< arr.length; i++) {
            cArr.push(<Option key={arr[i]}>{arr[i]}</Option>);
        }
        this.setState({
            childrenArr: arr,
            children: cArr,
            defaultValue: this.props.value,
            selectedValue: this.props.value ? this.props.value : []
        })
    }

    componentDidMount(){
        this.getData()
    }
    render() {
        return (
            <Select
                className="customer-multi-select"
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="请点击多选"
                value={this.state.selectedValue}
                defaultValue={this.state.defaultValue}
                onChange={this.handleChange}
            >
                {this.state.children}
            </Select>
        )
    }
    
}

export default MultiSelect



