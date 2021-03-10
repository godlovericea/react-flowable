// 自定义Form Render组件
import React, { useState, useEffect, useRef } from 'react'
import { Select } from 'antd';
import { getSelectName } from '../../apis/process';
import './SearchSelect.less';
const { Option } = Select;

const SearchSelect =(myOptions)=> {
    const [optionList, setOptionList] = useState([])
    const hanldeChange=(value)=>{
        console.log(value)
        myOptions.onChange(myOptions.name, value)
    }
    const onSearch=(e)=>{
        console.log(e)
    }
    const getData = ()=>{
        let arr1 =  myOptions.name.split('_')
        let str = arr1[arr1.length-1]
        getSelectName(str)
        .then((res)=>{
            setOptionList(res.data)
        })
    }
    useEffect(()=>{
        getData()
    }, [])
    return (
        <div className="fileupload-wrapper">
            <Select
                showSearch
                optionFilterProp="children"
                onChange={hanldeChange}
                onSearch={onSearch}
                filterOption={(input, option) =>option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                    optionList.map((item,index)=>{
                        return(
                            <Option value={item.NODEVALUE} key={index}>{item.NODENAME}</Option>
                        )
                    })
                }
            </Select>
        </div>
    )
    
}

export default SearchSelect
