// 自定义FormRender组件——地图选择器
import React from 'react'
import { Tooltip, Button } from 'antd';
import './AMapContainer.less'
import { AimOutlined } from '@ant-design/icons';

class AMapContainer extends React.Component{

    state={
        pos: "",// 坐标位置
    }

    componentDidMount(){
        // console.log(this.props)
        
        this.setState({
            pos: this.props.value
        })
        
        window.addEventListener("message", e=>{
            // console.log(e.data.position)
            this.setState({
                pos: e.data.position
            }, ()=>{
                this.props.onChange(this.props.name, this.state.pos)
            })
        })
    }

    onFocus=()=>{
        window.parent.postMessage("showMap", "*")
    }

    render(){
        return(
            <div className="AMapContainer">
                <span className="pos-box">{this.state.pos}</span>
                <Tooltip title="请点击选择地图坐标" placement="right">
                    <Button type="primary" size="small" shape="round" icon={<AimOutlined />} onClick={this.onFocus}></Button>
                </Tooltip>
            </div>
        )
    }
    
}

export default AMapContainer