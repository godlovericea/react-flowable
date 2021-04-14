import { React } from "react";
import HomeList from './pages/process/Process';// 首页
import EditForm from './pages/EditForm/EditForm' // 编辑表单
import ShowForm from './pages/ShowForm/ShowForm' // 展示表单（查看自定义表单）
import NewForm from './pages/NewForm/NewForm' // 新建表单
import Transformer from './pages/Transform/Transform' // 表单转换（查看台账）
import Customize from './pages/Customize/Customize'// 自定义表单
import StartForm from './pages/StartForm/StartForm'// 流程发起页面
import NeedToDeal from './pages/NeedToDeal/NeedToDeal'// 流程在办页面
import DoneDeal from './pages/DoneDeal/DoneDeal'// 已办流程页面
import HistoryFlow from './pages/HistoryFlow/HistoryFlow'// 历史已办查询
import FlowPermission from './pages/FlowPermission/FlowPermission'// 流程权限配置
import StartPermission from './pages/StartPermission/StartPermission'// 流程发起权限配置
import EditbleSelct from './components/EditbleSelct/EditbleSelct'// 可编辑搜索
import SetFlowForm from './pages/SetFlowForm/SetFlowForm'// 设置流程表单
import TestFrGenerator from './pages/TestFrGenerator/TestFrGenerator'// 测试Generator
import LedgerAccount from './components/LedgerAccount/LedgerAccount'// 台账选择器测试
import EventList from './pages/EventList/EventList'// 事件列表
import EventTypeList from './pages/EventTypeList/EventTypeList'// 事件类型列表
import EventConfig from './pages/EventConfig/EventConfig'// 事件类型列表
import NewEventForm from './pages/NewEventForm/NewEventForm'// 新增事件
import EventShow from './pages/EventShow/EventShow'// 事件详情
import EventPermissionConfig from './pages/EventPermissionConfig/EventPermissionConfig'// 事件权限配置
import EventStartForm from './pages/EventStartForm/EventStartForm'// 事件发起表单填写
import EventStartPage from './pages/EventStartPage/EventStartPage'// 事件发起权限列表
import EventOnDealList from './pages/EventOnDealList/EventOnDealList'// 在办事件
import EventOperation from './pages/EventOperation/EventOperation'// 操作在办事件
import {Switch, Route, Redirect} from 'react-router-dom'

function App() {
  return (
    <div style={{height:'100%'}}>
        <Switch>
            <Route exact path="/home" component={HomeList}/>
            <Route exact path="/new" component={NewForm}/>
            <Route exact path="/edit" component={EditForm}/>
            <Route exact path="/show" component={ShowForm}/>
            <Route exact path="/trans" component={Transformer}/>
            <Route exact path="/cus" component={Customize}/>
            <Route exact path="/start" component={StartForm}/>
            <Route exact path="/need" component={NeedToDeal}/>
            <Route exact path="/done" component={DoneDeal}/>
            <Route exact path="/hisflow" component={HistoryFlow}/>
            <Route exact path="/permis" component={FlowPermission}/>
            <Route exact path="/stpermis" component={StartPermission}/>
            <Route exact path="/cascader" component={EditbleSelct}/>
            <Route exact path="/setform" component={SetFlowForm}/>
            <Route exact path="/testfr" component={TestFrGenerator}/>
            <Route exact path="/ledger" component={LedgerAccount}/>
            <Route exact path="/eventlist" component={EventList}/>
            <Route exact path="/eventtype" component={EventTypeList}/>
            <Route exact path="/eventconfig" component={EventConfig}/>
            <Route exact path="/newevform" component={NewEventForm}/>
            <Route exact path="/eventshow" component={EventShow}/>
            <Route exact path="/eventper" component={EventPermissionConfig}/>
            <Route exact path="/eventform" component={EventStartForm}/>
            <Route exact path="/eventstart" component={EventStartPage}/>
            <Route exact path="/eventondeal" component={EventOnDealList}/>
            <Route exact path="/eventoper" component={EventOperation}/>
            <Redirect to="/home"></Redirect>
        </Switch>
    </div>
    
  );
}
export default App;
