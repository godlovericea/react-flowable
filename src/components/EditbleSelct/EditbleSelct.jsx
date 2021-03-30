// 自定义FormRender组件——可编辑的下拉选择器
import React from 'react'
import { Select } from 'antd';

const { Option } = Select;

const EditbleSelct=(props)=>{
    console.log(props)
    // 处理数组
    const arr = props.options.value.split(',')
    let children = []
    for (let i = 0; i < arr.length; i++) {
        children.push(<Option key={arr[i]}>{arr[i]}</Option>);
    }
    // 把该值传递到FormRender
    function handleChange(value) {
        props.onChange(props.name, value)
    }

    return(
        <Select mode="tags" defaultValue={props.default} style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
            {children}
        </Select>
    )
}



export default EditbleSelct