import { React } from "react";
import HomeList from './pages/process/Process';// 首页
import EditForm from './pages/EditForm/EditForm' // 编辑表单
import ShowForm from './pages/ShowForm/ShowForm' // 展示表单（查看自定义表单）
import NewForm from './pages/NewForm/NewForm' // 新建表单
import Transformer from './pages/Transform/Transform' // 表单转换（查看台账）
import Customize from './pages/Customize/Customize'
import StartForm from './pages/StartForm/StartForm'
import NeedToDeal from './pages/NeedToDeal/NeedToDeal'
import DoneDeal from './pages/DoneDeal/DoneDeal'
import HistoryFlow from './pages/HistoryFlow/HistoryFlow'
import FlowPermission from './pages/FlowPermission/FlowPermission'
import StartPermission from './pages/StartPermission/StartPermission'
import EditbleSelct from './components/EditbleSelct/EditbleSelct'
import SetFlowForm from './pages/SetFlowForm/SetFlowForm'
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
            <Redirect to="/home"></Redirect>
        </Switch>
    </div>
    
  );
}
export default App;
