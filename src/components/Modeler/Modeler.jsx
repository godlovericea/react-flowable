// BPMN.JS加载
import React from "react";
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import CustomPaletteProvider  from 'bpmn-js-properties-panel/lib/provider/camunda'
import camundaExtension  from 'camunda-bpmn-moddle/resources/camunda.json'
import customTranslate from '../libs/customTranslate/customTranslate';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

import './Modeler.less'

var bpmnModeler = ""
class Modeler extends React.Component{
    constructor(props){
        super(props)
        // console.log(props)
    }
    
    initModeler=()=>{
        var customTranslateModule = {
        　　translate: ['value', customTranslate]
    　　 };
        bpmnModeler = new BpmnModeler({
            container: document.getElementById('container'),
            propertiesPanel: {
                parent: '#js-properties-panel'
            },
            moddleExtensions: {camunda: camundaExtension},
            additionalModules: [propertiesPanelModule,CustomPaletteProvider,customTranslateModule]
        });
        bpmnModeler.createDiagram(() => {
            bpmnModeler.get('canvas').zoom('fit-viewport');
        });
    }
    componentDidMount() {
        this.initModeler()
    }
    render() {
        return(
            <div className="modeler-wrapper">
                <div ref="container" id="container"></div>
                <div id="js-properties-panel" class="panel"></div>
                <div className="btn-groups"></div>
            </div>
        )
    }
}

export default Modeler