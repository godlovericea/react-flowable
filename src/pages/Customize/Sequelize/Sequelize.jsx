import React, { Component } from 'react'
import { Calendar } from 'antd';

export default class Sequelize extends Component {
    onPanelChange =(value, mode)=>{
        // console.log(value.format('YYYY-MM-DD'), mode);
    }
    onSelect=(value)=>{
        // console.log(value.format('YYYY-MM-DD'));
    }
    render() {
        return (
            <div>
                <Calendar onPanelChange={this.onPanelChange} onSelect={this.onSelect}></Calendar>
            </div>
        )
    }
}
