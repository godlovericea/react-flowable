// 编码生成器
import React from 'react'
import { Input } from 'antd'

const CodeGenerator=(props)=>{
    
    return(
        <div style={{width: '100%'}}>
            <Input value={props.value} style={{width: '100%'}}></Input>
        </div>
    )
}

export default CodeGenerator
