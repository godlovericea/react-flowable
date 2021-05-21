import React from 'react'
import { DatePicker } from 'antd';
import moment from 'moment'

const DateTimePicker=(props)=>{
    const onChange = (value, dateString) =>{
        // console.log('Formatted Selected Time: ', dateString);
        props.onChange(props.name, dateString)
    }
    
    const onOk = (value) =>{
        // console.log(value.format("YYYY-MM-DD HH:mm:ss"))
        props.onChange(props.name, value.format("YYYY-MM-DD HH:mm:ss"))
    }
    return(
        <DatePicker style={{width:'100%'}} showTime onChange={onChange} onOk={onOk} defaultValue={moment(moment(), "YYYY-MM-DD HH:mm:ss")} format="YYYY-MM-DD HH:mm:ss"/>
    )
}

export default DateTimePicker
