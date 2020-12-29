import { React } from "react";
import { BrowserRouter as Router,Switch, Route, Link } from 'react-router-dom'; 
import 'antd/dist/antd.css';
import "./styles/process_iframe.less";
import Process from "./pages/process/Process";
import Task from "./pages/task/Task";

function App() {
  return (
    <Router>
        <Switch>
            <Route exact path="/" component={Process}></Route>
            <Route path="/task" component={Task}></Route>
        </Switch>
    </Router>
  );
}

export default App;
