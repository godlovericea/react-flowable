// 自定义FormRender组件——人员选择器
import React, { useState, useEffect } from 'react'
import { Modal, Button, Radio, Input, Tooltip } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { getUserListForRole } from '../../apis/process';
import './StaffSelectWidget.less';
const { Search } = Input;

const StaffSelectWidget =(props)=> {
    const [visible, setVisible] = useState(false)
    const [personArr, setPersonArr] = useState([])
    const [personList, setPersonList] = useState([])
    const [person, setPerson] = useState(props.value)
    const getData =()=>{
        getUserListForRole()
        .then((res)=>{
            let arr = []
            res.data.getMe.forEach((item)=>{
                if (item.LevelCode.indexOf('1-24') > -1) {
                    arr.push(item)
                }
            })
            setPersonArr(arr)
            setPersonList(arr)
        })
    }
    const onFocus = ()=>{
        setVisible(true)
    }
    const onOk=()=>{
        setVisible(false)
        props.onChange(props.name, person)
    }
    const onCancel=()=>{
        setVisible(false)
        getData()
    }
    const onChange=(e)=>{
        setPerson(e.target.value)
    }
    const handleChange=(e)=>{
        setPerson(e.target.value)
    }
    const onSearch=(e)=>{
        let arr = []
        personList.map((item) => {
            let list = {
                OUID: item.OUID,
                OUName: item.OUName,
                userList: []
            }
            item.userList.map((user) => {
                if (user.userName.indexOf(e) > -1) {
                    list.userList.push(user);
                }
            })
            if (list.userList.length) {
                arr.push(list);
            }
        })
        setPersonArr(arr)
    }
    useEffect(()=>{
        getData()
    }, [])
    return (
        <div className="personselect-wrapper">
            
            <div>
                <span className="selectvalue">{person}</span>
                <Tooltip title="请点击选择人员" placement="right">
                    <Button type="primary" size="small" shape="round" icon={<UserAddOutlined />} onClick={onFocus}></Button>
                </Tooltip>
            </div>
            <Modal title="人员选择器" visible={visible} onOk={onOk} onCancel={onCancel} wrapClassName="personModalClass" bodyStyle={{height:'500px',overflowY:'auto'}}>
                <Search
                    placeholder="请输入姓名"
                    allowClear
                    className="personModalSearchClass"
                    onSearch={onSearch}
                    enterButton 
                />
                {
                    personArr.map((item,index)=>{
                        return(
                            <form key={index} className="fieldset-class">
                                <fieldset className="person-select">
                                    <legend className="personheader">{item.OUName}</legend>
                                    <Radio.Group className="person-radio" name="person" onChange={handleChange} value={person}>
                                        {
                                            item.userList.map((child,childIndex)=>{
                                                return(
                                                    <Radio key={childIndex} value={child.userName}>{child.userName}</Radio>
                                                )
                                            })
                                        }
                                    </Radio.Group>
                                </fieldset>
                            </form>
                        )
                    })
                }
            </Modal>
        </div>
    )
    
}

export default StaffSelectWidget
