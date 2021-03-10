import React, { useState } from "react";
import FormRender from "form-render/lib/antd";
import SCHEMA from "./schema.json";
import Cascade from "./Cascader/Cascader";
import Calendar from './Sequelize/Sequelize'
class Demo extends React.Component {
    state = {
        formData: {},
        valid: []
    }

    submit = () => {
        if (this.state.valid.length > 0) {
            alert("没有通过校验");
        } else {
            alert(JSON.stringify(this.state.formData, null, 4));
        }
    };

    onValidate = valid => {
        console.log(valid);
    }
    listenChange=(params)=>{
        console.log(params)
    }
    render(){
        return (
            <div style={{ padding: 60 }}>
                <FormRender
                    {...SCHEMA}
                    formData={this.state.formData}
                    onChange={this.listenChange}
                    onValidate={this.onValidate}
                    widgets={{ cascade: Cascade,calendar: Calendar }}
                />
                <button onClick={this.submit}>提交</button>
            </div>
        );
    }
}

export default Demo
