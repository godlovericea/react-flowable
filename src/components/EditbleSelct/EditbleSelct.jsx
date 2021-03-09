import React from 'react'
import { Select } from 'antd';

const { Option } = Select;

const EditbleSelct=(props)=>{
    const arr = props.options.value.split(',')
    let children = []
    for (let i = 0; i < arr.length; i++) {
        children.push(<Option key={arr[i]}>{arr[i]}</Option>);
    }

    function handleChange(value) {
        props.onChange(props.name, value)
    }

    return(
        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>
            {children}
        </Select>
    )
}



export default EditbleSelct