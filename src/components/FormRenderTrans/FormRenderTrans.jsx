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
    const [FormKey, setFormKey] = useState('')
    const [formId, setFormId] = useState('')
    const [valid, setValid] = useState([])
    const [column, setColumn] = useState(3)
    const formRef = useRef();
    
    const judgeFormType=()=>{
        console.log(props)
        const { formType, schemaStr } = props
        if (formType === "台账") {
            getData()
        } else {
            console.log(schemaStr)
            let schemaData = `${schemaStr}`
            setSchema(JSON.parse(schemaData))
        }
    }

    const getData = ()=>{
        console.log(props)
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

    useEffect(()=>{
        // judgeFormType()
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
        </div>
    );
}

export default FormRenderTrans