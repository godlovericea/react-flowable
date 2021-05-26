// 自定义FormRender组件——可编辑的下拉选择器
import React, {useState, useEffect, useRef} from 'react'
import { Cascader } from 'antd';
import './CityPicker.less'
import ChineseDistricts from '../../libs/ChineseDistricts/ChineseDistricts';// 数据源

class CityPicker extends React.Component{
    state={
        chinaData: [],//cascader数据源
        address: '', // 地址
    }
    // 拉取第一层数据：省份
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
    // 处理第二层级数据：城市
    handleCity=(code)=>{
        let city = []
        for(let key in ChineseDistricts) {
            // 判断各自的分区
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
    // 处理第三层级数据：区或者县
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
    // 监听数据改变的方法
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