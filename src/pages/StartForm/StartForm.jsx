// 流程发起页面
import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button, message, Input, Modal, Radio } from 'antd';
import FormTransfer from '../../libs/transform/transform'
import FormDataValid from '../../libs/FormDataValid/FormDataValid'
import ConfigSchemaClass from '../../libs/configSchema/configSchema'
import { GetStartForm, WorkflowStart, getTableName, GetTransferList_FirstNode, AddProduct } from '../../apis/process'
import "./StartForm.less"
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
import ProductInfo from '../../components/ProductInfo/ProductInfo'
import FormRenderWidgets from '../../libs/FormRenderWidgets/FormRenderWidgets'
const { Search } = Input;

let actArr = []
const StartForm = (props) => {
    // FormRender的formData
    const [formData, setFormData] = useState({});
    // FormRender的 schema
    const [schema, setSchema] = useState({})
    // 表单的key
    const [FormKey, setFormKey] = useState('')
    // 表单的id
    const [formId, setFormId] = useState('')
    // formRender 校验 数组
    const [valid, setValid] = useState([])
    // schema的配置文件，需要每次传递保存
    const [configSchema, setConfigSchema] = useState('')
    // form render 的ref
    const formRef = useRef();
    // 会签选择候选人Modal
    const [nextPersonVisible, setNextPersonVisible] = useState(false)
    // 移交人数组
    const [chooseArr, setChooseArr] = useState([])
    // 会签时候，点击完成，候选人列表
    const [assigneeList, setAssigneeList] = useState([])
    // 加载产品信息得白名单数组
    const [isShowProduct, setIsShowProduct] = useState(false)
    // workId
    const [ProductModels, setProductModels] = useState([])
    // userName
    const [myUserName, setMyUserName] = useState("")

    // 校验提交表单
    const onValidate=(valid)=>{
        setValid(valid)
    }
    // 判断是否要加产品信息组件
    const judgeShowProduct=(formKey)=>{
        if (formKey === "事件_销售管理_项目新建审批表_技术员"){
            setIsShowProduct(true)
        } else {
            setIsShowProduct(false)
        }
    }
    // 子组件传值给父组件
    const getProductInfo=(data)=>{
        setProductModels(data)
    }

    // 拉取数据
    const getData =async()=>{
        // 流程ID
        let FlowDefID = props.location.state.FlowDefID
        // 用户名
        let userName = props.location.state.userName
        // 站点
        let site = props.location.state.site
        setMyUserName(userName)
        // 用户部门
        let userDepart = props.location.state.userDepart
        // 拉取发起流程的第一个节点的表单
        let res =await GetStartForm(FlowDefID)
        
        if (res.data.Errmsg) {
            alert(res.data.Errmsg)
            return
        }
        setFormId(res.data.FormID)
        setFormKey(res.data.FormKey)
        judgeShowProduct(res.data.FormKey)

        if (res.data.Type === "台账") {
            const tableName = res.data.Form
            // 通过台账名称取查询台账字段
            let response = await getTableName(tableName)
            // 接受台账字段数组
            const dataArr = response.data.getMe[0].Groups
            // 处理台账各种字段
            let formTransfer = new FormTransfer(dataArr)
            // 由于异步，需要在外边手动调用处理方法，拿到处理结果
            let schemadata =await formTransfer.handleGroup()
            
            setSchema(schemadata)
            setConfigSchema(JSON.stringify(schemadata))
            
        } else {
            let fieldData = res.data
            setConfigSchema(fieldData.Form)

            // web4配置文件，用户名，用户部门
            const web4Config = {
                userName: userName,
                userDepart: userDepart,
                site: site
            }
            // 处理表单数据
            const testData = new ConfigSchemaClass(fieldData.ColumnConfig, fieldData.Form, web4Config)
            setSchema(testData.schema)
        }
    }
    useEffect(()=>{
        getData()
    },[])

    const handleArray=(arr)=> {
        let str = ""
        if (arr.length === 0){
            str = ""
        } else if (arr.length === 1) {
            str = arr[0] + "#=#"
        } else {
            str = arr.join("#=#")
        }
        return str
    }

    // 处理FormRenderBaseType
    const handleFormRenderBaseType = (formData, configSchema)=>{
        let arr = []
        const { properties } = JSON.parse(configSchema).schema
        for (const key in properties) {
            for(const fkey in formData) {
                if (key === fkey) {
                    for(const ckey in properties[key].properties){
                        for(const cfkey in formData[fkey]) {
                            if (ckey === cfkey) {
                                let tempValue = formData[fkey][cfkey]
                                if (Array.isArray(formData[fkey][cfkey])) {
                                    tempValue = handleArray(formData[fkey][cfkey])
                                }
                                arr.push({
                                    Type: properties[key].properties[ckey].type,
                                    Name: properties[key].properties[ckey].title,
                                    Value: tempValue,
                                    Code: properties[key].properties[ckey].hasOwnProperty("code") && properties[key].properties[ckey].code ? properties[key].properties[ckey].code : ""
                                })
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }

    // 提交
    const handleSubmitFirst = () =>{
        // console.log(valid)
        if (valid.length > 0) {
            const validData = new FormDataValid(valid, configSchema)
            message.error(validData.validMsg)
            return
        }
        if(!formId){
            message.error("提交失败！原因：该表单未部署成功，请联系系统管理员！")
            return
        }
        // 流程定义ID
        let processDefinitionId = props.location.state.FlowDefID

        let arr = processDefinitionId.split(":")

        // 流程名称
        let flowName = arr[0]
        // 用户ID
        let userId = props.location.state.userId
        // 事件编号
        let evCode = props.location.state.evCode || ""
        // 登录名
        let loginName = props.location.state.loginName || ""
        // flowable-engine内部鉴权使用的cookie
        let cookie = ""
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookie = itemArr[1]
            }
        })
        const dateEn = ["January","February","March","April","May","June", "July", "August", "September", "October", "November","December"]
        let monthName = ""
        const date = new Date()
        const month = date.getMonth()
        dateEn.forEach((item,index)=>{
            if (index === month) {
                monthName = item
            }
        })
        const day = date.getDate()
        const year = date.getFullYear()
        var FormInfo=JSON.stringify({
            formId,
            values: formData
        })
        const myData = {
            formId,
            FormInfo,
            Config: configSchema,
            processDefinitionId,
            name: `${flowName} - ${monthName} ${day}th ${year}`,
            FormKey: FormKey,
            FormRenderBaseList: handleFormRenderBaseType(formData, configSchema)
        }
        GetTransferList_FirstNode(cookie, userId, evCode, myData)
        .then((res)=>{
            if (res.data.say.statusCode === "0000") {
                if (res.data.getMe.length > 0) {
                    // 所有会签节点的候选人的数量之和
                    let assLength = 0
                    for(let i = 0; i < res.data.getMe.length; i++) {
                        assLength += res.data.getMe[i].PersonInfoList.length
                    }
                    if (assLength === 0) {
                        message.success("当前节点已完成")
                    } else {
                        // 打开Modal
                        setNextPersonVisible(true)
                        // 拿取候选人数组
                        // console.log(res.data.getMe)
                        setAssigneeList(res.data.getMe)
                    }
                } else {
                    message.success("当前节点已完成")
                    setNextPersonVisible(false)
                }
                if (isShowProduct) {
                    let sayInfoArr = res.data.say.info.split(",")
                    let params = {
                        WorkId: sayInfoArr[1],
                        tableName: FormKey,
                        InputPerson: myUserName,
                        ProductModels: ProductModels
                    }
                    AddProduct(params)
                    .then((response)=>{

                    })
                }
            } else {
                message.error(res.data.say.errMsg)
            }
        })
    }

    // 重置按钮
    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
            alert(JSON.stringify(res, null, 2));
        });
    };

    const handleGoBack=()=>{
        // props.history.push({
        //     pathname: '/form-render/stpermis'
        // })
        props.history.go(-1)
    }

    // 选择候选人
    const hanldeAssignChange=(e)=>{
        // console.log(e, "e")
        // console.log(assigneeList, "assigneeList")
        actArr.push({
            ActID: e.target.actid,
            UserID: e.target.value
        })
        actArr.forEach((item)=>{
            if (item.ActID === e.target.actid) {
                item.UserID = e.target.value
            }
        })
        setChooseArr(actArr)
        // setWorkCode(e.target.value)
    }
    // 完成关闭
    const closeNextPersonModeler=()=>{
        setNextPersonVisible(false)
    }

    // 选择候选人之后，完成确定
    const sureNextPersonModeler=()=>{
        let assignArr = []
        assigneeList.forEach((item)=>{
            if (item.PersonInfoList.length > 0) {
                assignArr.push(item)
            }
        })
        if (actArr.length === 0){
            message.error("请选择移交人！")
            return
        }
        var result = [];
        var obj = {};
        for(var i =0; i<chooseArr.length; i++){
            if(!obj[chooseArr[i].ActID]){
                result.push(chooseArr[i]);
                obj[chooseArr[i].ActID] = true;
            }
        }
        if (result.length !== assignArr.length) {
            message.error("请给每个节点选择移交人")
            return
        }
        // 流程定义ID
        let processDefinitionId = props.location.state.FlowDefID

        let arr = processDefinitionId.split(":")

        // 流程名称
        let flowName = arr[0]
        // 用户ID
        let userId = props.location.state.userId
        // 事件编号
        let evCode = props.location.state.evCode || ""
        // 登录名
        let loginName = props.location.state.loginName || ""
        // flowable-engine内部鉴权使用的cookie
        let cookie = ""
        let winCookie = window.document.cookie
        // console.log(winCookie)
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                cookie = itemArr[1]
            }
        })
        const dateEn = ["January","February","March","April","May","June", "July", "August", "September", "October", "November","December"]
        let monthName = ""
        const date = new Date()
        const month = date.getMonth()
        dateEn.forEach((item,index)=>{
            if (index === month) {
                monthName = item
            }
        })
        const day = date.getDate()
        const year = date.getFullYear()
        var FormInfo=JSON.stringify({
            formId,
            values: formData
        })
        const myData = {
            formId,
            FormInfo,
            Config: configSchema,
            processDefinitionId,
            name: `${flowName} - ${monthName} ${day}th ${year}`,
            FormKey: FormKey,
            TranserSaveModelList: result
        }
        WorkflowStart(cookie, userId, evCode, loginName, myData)
        .then((res)=>{
            setNextPersonVisible(false)
            message.success("任务移交成功！")
        })
    }
    // 搜索移交人
    const onTransferSearch=(e)=>{
        let listArr = []
        var ename = e
        assigneeList.map((item) => {
            let list = {
                ActID: item.ActID,
                PersonInfoList: [],
                PointName: item.PointName
            }
            item.PersonInfoList.map((user) => {
                if (user.UserName.indexOf(ename) > -1 || user.UserID.indexOf(ename) > -1) {
                    list.PersonInfoList.push(user);
                }
            })
            if (list.PersonInfoList.length) {
                listArr.push(list);
            }
        })
        setAssigneeList(listArr)
    }

    return (
        <div className="startwrap-page">
            <div className="form-info-box">
                <div className="form-info-before"></div>
                <div>{props.location.state.name}</div>
            </div>
            <div className="header-content-divider"></div>
            {/* <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
                onValidate={onValidate}
                showValidate={false}
                widgets={{ staff: StaffSelectWidget, cascader: TreeCascader, search: SearchSelect, TableAccount: TableAccount, file:UploadFile, editSearch: EditbleSelct, 
                    mapSelect: AMapContainer,cityPicker: cityPicker, multiSelect: multiSelect, DateTimePicker: DateTimePicker,CodeGenerator:CodeGenerator }}
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
            {
                isShowProduct ? 
                <div className="product-info-box">
                    <ProductInfo getProductInfo={getProductInfo} showAddProductButton={true}></ProductInfo>
                </div>
                :
                null
            }
            <div className="btngroups">
                <Button type="primary" style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleSubmitFirst}>发起</Button>
                <Button style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleClick}>重置</Button>
                <Button style={{ marginLeft: 30 }} className="table-oper-btn" onClick={handleGoBack}>返回</Button>
            </div>
            <Modal title="请选择候选人" visible={nextPersonVisible} onCancel={closeNextPersonModeler} onOk={sureNextPersonModeler} width={650}>
                <div>
                    <Search placeholder="请输入姓名" onSearch={onTransferSearch} enterButton />
                    {
                        assigneeList.map((item, index)=>{
                            return(
                                <div key={index} className="radio-wrapper">
                                    {
                                        item.PersonInfoList.length > 0 ?
                                            <div className="radio-content">
                                                <div className="radio-title">{item.PointName}</div>
                                                <Radio.Group name="assigngroup" onChange={hanldeAssignChange}>
                                                    {
                                                        item.PersonInfoList.map((cItem,cIndex)=>{
                                                            return(
                                                                <Radio key={cIndex} actid={item.ActID} value={cItem.UserID}>{cItem.UserName}</Radio>
                                                            )
                                                        })
                                                    }
                                                </Radio.Group>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                
            </Modal>
        </div>
    );
};

export default StartForm;