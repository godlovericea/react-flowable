import React, { useState, useEffect, useRef } from 'react'
import { Cascader } from 'antd';
import { getSelectName } from '../../apis/process'

const TreeCascader = (myoptions) => {
    const [firstNode, setFirstNode] = useState('')
    const [secNode, setSecNode] = useState('')
    const [options, setOptions] = useState([])

    const getfirstData =()=>{
        console.log(myoptions)
        let arr = myoptions.name.split('_')
        let str = arr[arr.length - 1]
        let arr2 = str.split('.')
        setFirstNode(arr2[0])
        setSecNode(arr2[1])
        getSelectName(arr2[0])
        .then((res)=>{
            let optionArr = []
            res.data.forEach((item)=>{
                optionArr.push({
                    label: item.NODENAME,
                    value: item.NODEVALUE,
                    isLeaf: false
                })
            })
            setOptions(optionArr)
        })
    }
    const handleChange = (value, selectedOptions) => {
        myoptions.onChange(myoptions.name, myoptions.value)
    };

    const loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        getSelectName(secNode)
        .then((res)=>{
            let valData = ''
            res.data.forEach(item=>{
                if (targetOption.value === item.NODENAME) {
                    valData = item.NODEVALUE
                }
            })
            targetOption.loading = false;
            targetOption.children = [
                {
                    label: valData,
                    value: valData
                }
            ]
            setOptions([...options]);
        })

    };
    useEffect(()=>{
        getfirstData()
    }, [])
    
    return <Cascader options={options}  loadData={loadData} onChange={handleChange} style={{width:'100%'}} changeOnSelect className="cascaderClass"/>;
};

export default TreeCascader
