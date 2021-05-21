// 自定义FormRender组件——下拉搜索组件
import React, { useState, useEffect, useRef } from 'react'
import { Select } from 'antd';
import { getSelectName } from '../../apis/process';
import './SearchSelect.less';
const { Option } = Select;

const SearchSelect =(myOptions)=> {
    const [optionList, setOptionList] = useState([])
    const hanldeChange=(value)=>{
        myOptions.onChange(myOptions.name, value)
    }
    const onSearch=(e)=>{
        // console.log(e)
    }
    const getData = ()=>{
        let str = ""
        if (myOptions.options && myOptions.options.value) {
            str = myOptions.options.value
        } else {
            return
        }
        getSelectName(str)
        .then((res)=>{
            setOptionList(res.data)
        })
    }
    useEffect(()=>{
        getData()
    }, [])
    return (
        <div className="select-search-wrapper" style={{width:'100%'}}>
            <Select
                showSearch
                optionFilterProp="children"
                onChange={hanldeChange}
                onSearch={onSearch}
                style={{width:'100%'}}
                defaultValue={myOptions.value}
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
