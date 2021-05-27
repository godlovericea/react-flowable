// 查看表单组件
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import { getTableName } from '../../apis/process'
import "./FormRenderTrans.less"
import FormRenderWidgets from '../../libs/FormRenderWidgets/FormRenderWidgets'


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
            if (res.data.say.statusCode === "0000") {
                const dataArr = res.data.getMe[0].Groups
                let formTransfer = new FormTransfer(dataArr)
                let schema =await formTransfer.handleGroup()
                setSchema(schema)
                props.handleSchema(schema)
            } else {
                message.error(res.data.say.errMsg)
            }
        })
    }

    const onValidate=(valid)=>{
        setValid(valid)
    }

    useEffect(()=>{
        getData()
    }, [])

    return (
        <div className="startwrap">
            {/* <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, 
                    editSearch: EditbleSelct, mapSelect: AMapContainer, cityPicker: cityPicker, multiSelect: multiSelect, 
                    DateTimePicker:DateTimePicker, CodeGenerator: CodeGenerator }}
            /> */}
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={FormRenderWidgets}
            />
        </div>
    );
}

export default FormRenderTrans