// 自定义Form Render组件
import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Radio, Input,message } from 'antd';
import { uploadToService } from '../../apis/process';
import { CloudUploadOutlined } from '@ant-design/icons';
import './UploadFile.less';
const { Search } = Input;

const UploadFile =(props)=> {
    const [upFileName, setUpFileName] = useState(null)
    const [taskId, setTaskId] = useState(window.taskId)

    const handleChange=(e)=>{
        console.log(e)
        setUpFileName(e.target.files[0])
    }

    // 确定上传附件
    const sureUploadVisible=()=>{
        var _url = document.referrer + "cityinterface/rest/services/filedownload.svc/uploadfile/workflow/"+ props.name +'/' + upFileName.name;
        var formData = new FormData();
        formData.append("filedata", upFileName);
        var request = new XMLHttpRequest();
        request.open("POST", encodeURI(_url));
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    try {
                        var data = JSON.parse(request.responseText);
                        if (data && data.success) {
                            message.success("数据上传成功");
                            // fileuploadToService('workflow', taskId ,upFileName.name)
                            props.onChange(props.name, upFileName)
                        } else {
                            message.error("上传失败")
                        }
                    } catch (e) {
                        message.error("上传失败")
                    }
                } else {
                    message.error("上传失败")
                }
            }
        }
        request.send(formData);
    }
    // 上传文件至服务器
    const fileuploadToService=(folderName, timeStamp, fileName)=> {
        const FilePath = `/${folderName}/${timeStamp}/${fileName}`
        uploadToService(taskId, FilePath)
        .then((res)=>{
            if (res.data.statusCode === "0000") {
                message.success("上传成功！")
                // setUploadVisible(false)
            } else {
                message.error(res.data.errMsg)
            }
        })
    }
    useEffect(()=>{
    }, [])
    return (
        <div className="fileupload-wrapper">
            <Input.Group compact>
                <Input size="small" type="file" style={{ width: '80%' }} placeholder="请点击选择文件" onChange={handleChange}></Input>
                <CloudUploadOutlined size="small" style={{ width: '20%' }} type="primary" className="uploadBtn" onClick={sureUploadVisible}>上传</CloudUploadOutlined>
            </Input.Group>
        </div>
    )
    
}

export default UploadFile
