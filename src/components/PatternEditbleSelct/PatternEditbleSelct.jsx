// 自定义FormRender组件——可编辑的下拉选择器
import React from 'react'
import { Select } from 'antd';

const { Option } = Select;

const PatternEditbleSelct=(props)=>{
    console.log(props, "123456")
    // 处理数组
    let children = []
    let arr = []
    // if (props.options && props.options.value) {
    //     arr = props.options.value.split(',')
    //     for (let i = 0; i < arr.length; i++) {
    //         children.push(<Option key={arr[i]}>{arr[i]}</Option>);
    //     }
    // }
    // 把该值传递到FormRender
    function handleChange(value) {
        props.onChange(props.name, value)
    }

    return(
        <Select mode="tags" defaultValue={props.default} style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
            {/* {children} */}
            <Option key='1'>1</Option>
            <Option key='2'>2</Option>
            <Option key='3'>3</Option>
        </Select>
    )
}



export default PatternEditbleSelct