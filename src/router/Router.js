import { React } from "react";
import { BrowserRouter as Router,Switch, Route, Link } from 'react-router-dom';
import Process from '../pages/process/Process'
import Task from '../pages/task/Task'

function MyRouter(){
    return(
        <Router>
            <Switch>
                <Route exact path="/" component={Process}></Route>
                <Route path="/task" component={Task}></Route>
            </Switch>
        </Router>
    )
}

export default MyRouter