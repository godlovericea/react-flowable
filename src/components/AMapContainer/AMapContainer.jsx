// 自定义FormRender组件——可编辑的下拉选择器
import React, {useState, useEffect, useRef} from 'react'
import { Modal, Tooltip, Button, Input, message } from 'antd';
import './AMapContainer.less'
import { AimOutlined } from '@ant-design/icons';
const { Search } = Input

class AMapContainer extends React.Component{
    // const [map, setMap] = useState(null)
    state={
        mapVisible: false,
        pos: null,
        map: null,
        placeSearch: null,
        markerList: []
    }

    initMap =()=>{
        this.state.map = new window.AMap.Map("map-container", {
            // mapStyle: 'amap://styles/6a4d8fa0c4bdf98ac62d516046769109',
            resizeEnable: true,
            zoom: 12
        })
        
        this.state.placeSearch = new window.AMap.PlaceSearch({
            map: this.state.map, // 展现结果的地图实例
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        
        window.AMap.event.addListener(this.state.map, "click", (e)=> {
            this.setState({
                pos: `${e.lnglat.lng},${e.lnglat.lat}`
            })
        })
    }
    onFocus=()=>{
        this.setState({
            mapVisible: true
        },()=>{
            this.initMap()
        })
    }
    handlePosition=()=>{
        if (!this.state.pos){
            message.error("请点击地图选择坐标！")
            return
        }
        this.setState({
            mapVisible: false
        },()=>{
            this.props.onChange(this.props.name, this.state.pos)
        })
    }
    closeModal=()=>{
        this.setState({
            mapVisible: false
        })
    }
    onSearch=(data)=>{
        this.state.placeSearch.search(data)
    }
    componentDidMount(){
        // console.log(this.props)
    }
    render(){
        return(
            <div className="AMapContainer">
                <span className="pos-box">{this.state.pos}</span>
                <Tooltip title="请点击选择地图坐标" placement="right">
                    <Button type="primary" size="small" shape="round" icon={<AimOutlined />} onClick={this.onFocus}></Button>
                </Tooltip>
                <Modal title="坐标选择器" visible={this.state.mapVisible} onOk={this.handlePosition} onCancel={this.closeModal} width={600} wrapClassName="map-modal"
                bodyStyle={{display:'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}}>
                    <div className="map-content">
                        <Search
                            addonBefore="请输入关键字搜索"
                            placeholder="请输入地址"
                            onSearch={this.onSearch}
                            style={{width: 500}}
                        />
                    </div>
                    <div id="map-container"></div>
                </Modal>
            </div>
        )
    }
    
}

export default AMapContainer