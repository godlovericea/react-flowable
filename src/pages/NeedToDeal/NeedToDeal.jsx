import React, { useState, useEffect, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
import { GetFormJson } from '../../apis/process'
import './NeedToDeal.less'

const NeedToDeal = (props) => {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState({})
    const [cookie, setCookie] = useState({})
    const formRef = useRef();
    const getData =()=>{
        // const id = props.location.state.id
        // GetFormJson(id)
        // .then((res)=>{
        //     if (res.status === 200) {
        //         setSchema(JSON.parse(res.data))
        //     }
        // })
    }
    // 处理请求参数
    const hanldeRouterParams =()=>{
        // 处理Cookie
        let winCookie = window.document.cookie
        let winCookieArr = winCookie.split(";")
        winCookieArr.forEach((item)=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > -1) {
                let itemArr = item.split("=")
                setCookie(itemArr[1])
            }
        })

        // 处理任务ID
        const search = window.location.search.slice(1)
        const searchArr = search.split("&")
        searchArr.forEach((item)=>{
            // if (item.indexOf("processDefinitionId") > -1) {
            //     processDefinitionId = decodeURI(item.split("=")[1])
            // } else if (item.indexOf("name") > -1) {
            //     name = decodeURI(item.split("=")[1])
            // } else if (item.indexOf("userId") > -1) {
            //     userId = item.split("=")[1]
            // }
        })
    }
    const handleClick = () => {
        formRef.current.resetData({}).then(res => {
        alert(JSON.stringify(res, null, 2));
        });
    };

    const handleClickReback = ()=>{
        props.history.push({
            pathname: '/home'
        })
    }

    useEffect(()=>{
        getData()
        hanldeRouterParams()
    }, [])

    return (
        <div>
            <div className="deal-headerbox">
                <h2 className="dealheaders">流程发起</h2>
                <div className="dealdetails">
                    <p className="detail-items">处理人：王万里</p>
                    <p className="detail-items">起始时间：2021-02-25 10：00：00</p>
                    <p className="detail-items">起始时间：2021-02-25 10：00：00</p>
                    <p className="detail-items">处理人：王万里</p>
                </div>
            </div>
            <div className="btnGroups">
                <Button type="primary" shape="round" style={{ marginRight: 15 }} onClick={handleClickReback}>保存</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15 }} onClick={handleClickReback}>完成</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15 }} onClick={handleClickReback}>保存</Button>
                <Button type="primary" shape="round" style={{ marginRight: 15 }} onClick={handleClickReback}>保存</Button>
            </div>
            
            <FormRender
                ref={formRef}
                {...schema}
                formData={formData}
                onChange={setFormData}
            />
        </div>
    );
};

export default NeedToDeal;