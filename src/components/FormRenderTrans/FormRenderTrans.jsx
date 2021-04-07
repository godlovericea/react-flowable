// 查看表单组件
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import { getTableName } from '../../apis/process'
import TreeCascader from '../../components/TreeCascader/TreeCascader'
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget'
import TableAccount from '../../components/TableAccount/TableAccount'
import UploadFile from '../../components/UploadFile/UploadFile'
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct'
import SearchSelect from '../../components/SearchSelect/SearchSelect'

const FormRenderTrans=(props)=>{
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    const [valid, setValid] = useState([])
    const formRef = useRef();

    const getData = ()=>{
        // 台账的名称
        const {tableName} = props
        getTableName(tableName)
        .then(async(res)=>{
            const dataArr = res.data.getMe[0].Groups
            let formTransfer = new FormTransfer(dataArr)
            let schema =await formTransfer.handleGroup()
            setSchema(schema)
        })
    }

    const onValidate=(valid)=>{
        setValid(valid)
    }

    const transfer = () => {
        props.handleSchema(schema)
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div className="startwrap">
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, table: TableAccount, file:UploadFile, editSearch: EditbleSelct }}
            />
            <Button type="primary" shape="round" style={{marginLeft:'10px'}} onClick={transfer}>转换</Button>
        </div>
    );
}

export default FormRenderTrans