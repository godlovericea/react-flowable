import React from "react";
import { Cascader } from "antd";

const optionArray = [
    {
        value: "zhejiang",
        label: "Zhejiang",
        children: [
            {
                value: "hangzhou",
                label: "Hangzhou",
                children: [
                    {
                        value: "xihu",
                        label: "West Lake"
                    }
                ]
            }
        ]
    },
    {
        value: "jiangsu",
        label: "Jiangsu",
        children: [
            {
                value: "nanjing",
                label: "Nanjing",
                children: [
                    {
                        value: "zhonghuamen",
                        label: "Zhong Hua Men"
                    }
                ]
            }
        ]
    }
];

const CascaderInput=({options,value,rootValue,name,onChange})=> {
    const handleChange = (value) => {
        onChange(name, value);
    };

    return (
        <div style={{ width: "100%" }}>
            <Cascader
                options={optionArray}
                style={{ width: "100%" }}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}

export default CascaderInput
