// 外接表单管理
import React, {useEffect, useState} from 'react'
import {Table, Form, Input, Button, Modal } from 'antd'
import './ExtraForm.less'
const { Search } = Input

const ExtraForm=()=>{
    const [isVisible, setIsVisible] = useState(false)
    return(
        <div className="extraform-wrapper">
            <div className="form-headerbox">
                <Form layout="inline">
                    <Form.Item label="表单名称">
                        <Search placeholder="请输入表单名称" value={this.state.name} className="input-text-content" onChange={this.handleChange} onSearch={this.handleSearch} style={{ width: 200 }} />
                    </Form.Item>
                </Form>
                <Button className="localBtnClass rightBtn" size="small" type="primary" onClick={this.openModal}>新增</Button>
            </div>
            <div className="header-content-divider"></div>
            {

            }
        </div>
    )
}

export default ExtraForm