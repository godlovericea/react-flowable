import { React } from "react";
import EditForm from './pages/EditForm/EditForm'
import ShowForm from './pages/ShowForm/ShowForm'
import {Switch, Route, Redirect} from 'react-router-dom'

function App() {
  return (
    <div style={{height:'100%'}}>
        <Switch>
            <Route exact path="/edit" component={EditForm}/>
            <Route exact path="/show" component={ShowForm}/>
            <Redirect to="/edit"></Redirect>
        </Switch>
    </div>
    
  );
}
export default App;
