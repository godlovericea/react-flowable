// 自定义组件——暂无数据
import React from 'react'
import './NoData.less';
import NoDataImg from '../../assets/nodata.png'

const NoData = ()=>{
    return(
        <div className="nodataclass">
            <img src={NoDataImg} alt="暂无数据" />
            <p className="spanname">咦~没有查询到相关数据呢~</p>
        </div>
    )
}

export default NoData
