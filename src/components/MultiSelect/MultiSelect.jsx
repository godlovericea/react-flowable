import React, {useState} from 'react'
import { Select, Checkbox, Input } from 'antd';

const { Option } = Select;

const MultiSelect = (props) => {

    const [selectedValue, setSelectedValue] = useState([])

    const handleChange = (value) => {
        if (value.includes('全选')) {
            if (value.length === children.length) {
                setSelectedValue([])
                return
            }
            let tempArr = childrenArr.splice(1)
            setSelectedValue(tempArr)
            
        } else {
            setSelectedValue(value)
        }
        props.onChange(props.name, selectedValue)
    }

    const childrenArr = [
        "全选",
        "威派格",
        "青岛三利",
        "上海凯泉",
        "上海连城",
        "上海东方",
        "南方泵业",
        "中韩社科",
        "上海上源",
        "广州白云",
        "新界泵业",
        "海德隆",
        "上海艺迈",
        "格兰富",
        "赛莱默",
        "威乐",
        "汇中仪表",
        "迈拓仪表",
        "重庆伟岸测器制造",
        "威海天罡仪表",
        "浙江天信仪表",
        "青岛海威茨仪表",
        "上海肯特仪表",
        "深圳拓安信计控仪表",
        "新天科技",
        "武汉阿拉德拉利亚",
        "宁波水表",
        "三川智慧科技",
        "杭州竞达电子",
        "杭州山科智能科技",
        "青岛积成电子",
        "和达",
        "浙大中控",
        "众智鸿图",
        "杭州领图",
        "河南新天",
        "广州经纬",
        "广州粤海科荣",
        "上海昊沧",
        "重庆鑫森炬",
        "上海思天",
        "中地"
    ]
    let children = []
    for (let i = 0; i < childrenArr.length; i++) {
        children.push(<Option key={childrenArr[i]}>{childrenArr[i]}</Option>);
    }
    return (
        <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="请选择竞争对手"
            value={selectedValue}
            defaultValue={props.value}
            onChange={handleChange}
        >
            {children}
        </Select>
    )
}

export default MultiSelect



