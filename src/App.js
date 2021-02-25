import { React } from "react";
import HomeList from './pages/process/Process'
import EditForm from './pages/EditForm/EditForm'
import ShowForm from './pages/ShowForm/ShowForm'
import NewForm from './pages/NewForm/NewForm'
import Transformer from './pages/Transform/Transform'
import Customize from './pages/Customize/Customize'
import StartForm from './pages/StartForm/StartForm'
import NeedToDeal from './pages/NeedToDeal/NeedToDeal'
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
            <Redirect to="/home"></Redirect>
        </Switch>
    </div>
    
  );
}
export default App;
