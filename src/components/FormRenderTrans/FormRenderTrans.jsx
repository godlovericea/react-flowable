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
import AMapContainer from '../../components/AMapContainer/AMapContainer'
import cityPicker from '../../components/CityPicker/CityPicker'
import multiSelect from '../../components/MultiSelect/MultiSelect'
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker'
import CodeGenerator from '../../components/CodeGenerator/CodeGenerator'
import "./FormRenderTrans.less"


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
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, 
                    editSearch: EditbleSelct, mapSelect: AMapContainer, cityPicker: cityPicker, multiSelect: multiSelect, 
                    DateTimePicker:DateTimePicker, CodeGenerator: CodeGenerator }}
            />
            {/* <div className="gobackBtntrans">
                <Button  type="primary" style={{marginLeft:'10px',width:'100px'}} onClick={transfer}>转换</Button>
                <Button style={{width:'100px'}} onClick={this.handleClickReback}>
                        返回列表
                    </Button>
            </div> */}
        </div>
    );
}

export default FormRenderTrans