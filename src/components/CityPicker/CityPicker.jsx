// 自定义FormRender组件——可编辑的下拉选择器
import React, {useState, useEffect, useRef} from 'react'
import { Cascader } from 'antd';
import './CityPicker.less'
import ChineseDistricts from '../../libs/ChineseDistricts/ChineseDistricts';

class CityPicker extends React.Component{
    state={
        chinaData: [],
        address: ''
    }
    handleData=()=>{
        let province = []
        ChineseDistricts['86'].forEach((item)=>{
            const obj = {
                label: item.address,
                value: item.code,
                children: this.handleCity(item.code)
            }
            province.push(obj)
        })
        this.setState({
            chinaData: province
        })
    }
    handleCity=(code)=>{
        let city = []
        for(let key in ChineseDistricts) {
            if (key === code) {
                for(let cKey in ChineseDistricts[key]) {
                    city.push({
                        label: ChineseDistricts[key][cKey],
                        value: cKey,
                        children: this.handCounty(cKey)
                    })
                }
            }
        }
        return city
    }
    handCounty=(code)=>{
        let country = []
        for(let key in ChineseDistricts) {
            if (key === code) {
                for(let cKey in ChineseDistricts[key]) {
                    country.push({
                        label: ChineseDistricts[key][cKey],
                        value: cKey
                    })
                }
            }
        }
        return country
    }
    chinaChange=(data)=>{
        this.setState({
            address: data
        })
        this.props.onChange(this.props.name, data)
    }
    componentDidMount(){
        this.handleData()
        this.setState({
            address: this.props.value
        })
    }
    render(){
        return(
            <div style={{width:'100%'}}>
                <Cascader style={{width:'100%'}} value={this.state.address || this.props.value} options={this.state.chinaData} onChange={this.chinaChange} placeholder="请选择城市"></Cascader>
            </div>
        )
    }
}

export default CityPicker