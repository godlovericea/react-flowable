import { React } from "react";
import HomeList from '../pages/process/Process';// 首页
import EditForm from '../pages/EditForm/EditForm' // 编辑表单
import ShowForm from '../pages/ShowForm/ShowForm' // 展示表单（查看自定义表单）
import NewForm from '../pages/NewForm/NewForm' // 新建表单
import Transformer from '../pages/Transform/Transform' // 表单转换（查看台账）
import Customize from '../pages/Customize/Customize'// 自定义表单
import StartForm from '../pages/StartForm/StartForm'// 流程发起页面
import NeedToDeal from '../pages/NeedToDeal/NeedToDeal'// 流程在办页面
import DoneDeal from '../pages/DoneDeal/DoneDeal'// 已办流程页面
import HistoryFlow from '../pages/HistoryFlow/HistoryFlow'// 历史已办查询
import FlowPermission from '../pages/FlowPermission/FlowPermission'// 流程权限配置
import StartPermission from '../pages/StartPermission/StartPermission'// 流程发起权限配置
import SetFlowForm from '../pages/SetFlowForm/SetFlowForm'// 设置流程表单
import TestFrGenerator from '../pages/TestFrGenerator/TestFrGenerator'// 测试Generator
import EventList from '../pages/EventList/EventList'// 事件列表
import EventTypeList from '../pages/EventTypeList/EventTypeList'// 事件类型列表
import EventConfig from '../pages/EventConfig/EventConfig'// 事件类型列表
import NewEventForm from '../pages/NewEventForm/NewEventForm'// 新增事件
import EventShow from '../pages/EventShow/EventShow'// 事件详情
import EventPermissionConfig from '../pages/EventPermissionConfig/EventPermissionConfig'// 事件权限配置
import EventStartForm from '../pages/EventStartForm/EventStartForm'// 事件发起表单填写
import EventStartPage from '../pages/EventStartPage/EventStartPage'// 事件发起权限列表
import EventOnDealList from '../pages/EventOnDealList/EventOnDealList'// 在办事件
import EventOperation from '../pages/EventOperation/EventOperation'// 操作在办事件
import ProductInfo from '../components/ProductInfo/ProductInfo'// 操作在办事件
import ExtraForm from '../pages/ExtraForm/ExtraForm'// 台账选择器测试

import {Switch, Route, Redirect} from 'react-router-dom'


function MyRouter(){
    return(
        <Switch>
            <Route exact path="/form-render/home" component={HomeList}/>
            <Route exact path="/form-render/new" component={NewForm}/>
            <Route exact path="/form-render/edit" component={EditForm}/>
            <Route exact path="/form-render/show" component={ShowForm}/>
            <Route exact path="/form-render/trans" component={Transformer}/>
            <Route exact path="/form-render/cus" component={Customize}/>
            <Route exact path="/form-render/start" component={StartForm}/>
            <Route exact path="/form-render/need" component={NeedToDeal}/>
            <Route exact path="/form-render/done" component={DoneDeal}/>
            <Route exact path="/form-render/hisflow" component={HistoryFlow}/>
            <Route exact path="/form-render/permis" component={FlowPermission}/>
            <Route exact path="/form-render/stpermis" component={StartPermission}/>
            <Route exact path="/form-render/setform" component={SetFlowForm}/>
            <Route exact path="/form-render/testfr" component={TestFrGenerator}/>
            <Route exact path="/form-render/eventlist" component={EventList}/>
            <Route exact path="/form-render/eventtype" component={EventTypeList}/>
            <Route exact path="/form-render/eventconfig" component={EventConfig}/>
            <Route exact path="/form-render/newevform" component={NewEventForm}/>
            <Route exact path="/form-render/eventshow" component={EventShow}/>
            <Route exact path="/form-render/eventper" component={EventPermissionConfig}/>
            <Route exact path="/form-render/eventform" component={EventStartForm}/>
            <Route exact path="/form-render/eventstart" component={EventStartPage}/>
            <Route exact path="/form-render/eventondeal" component={EventOnDealList}/>
            <Route exact path="/form-render/eventoper" component={EventOperation}/>
            <Route exact path="/form-render/extraform" component={ExtraForm}/>
            <Route exact path="/form-render/product" component={ProductInfo}/>
            <Redirect to="/form-render/home"></Redirect>
        </Switch>
    )
}

export default MyRouter