// 台账的人员选择器组件（非FormRender自定义组件）
import React, { useState, useEffect } from 'react'
import { Modal, Button, Radio, Input } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { getUserListForRole } from '../../apis/process';
import './LoginNameSelect.less';
const { Search } = Input;

const LoginNameSelect =(props)=> {
    const [visible, setVisible] = useState(false)
    const [personArr, setPersonArr] = useState([])
    const [person, setPerson] = useState('')
    const [loginName, setLoginName] = useState('')
    const [userId ,setUserID] = useState('')
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
        })
    }
    const onFocus = ()=>{
        setVisible(true)
    }
    const onOk=()=>{
        setVisible(false)
        props.handleStaff(loginName, userId);
    }
    const onCancel=()=>{
        setVisible(false)
        getData()
    }
    const onChange=(e)=>{
        setPerson(e.target.value)
    }
    const handleChange=(e)=>{
        console.log(e)
        setPerson(e.target.value)
        setLoginName(e.target.loginName)
        setUserID(e.target.userID)
        console.log(person)
        console.log(loginName)
    }
    const onSearch=(e)=>{
        let arr = []
        personArr.map((item) => {
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
                <Button type="primary" size="small" shape="round" icon={<UserAddOutlined />} onClick={onFocus}></Button>
            </div>
            <Modal title="人员选择器" visible={visible} onOk={onOk} onCancel={onCancel} wrapClassName="personModalClass" bodyStyle={{height:'500px',overflowY:'auto'}}>
                <Search
                    placeholder="请输入姓名"
                    allowClear
                    onSearch={onSearch}
                    enterButton 
                />
                {
                    personArr.map((item,index)=>{
                        return(
                            <form key={index} className="fieldset-class">
                                <fieldset className="person-select">
                                    <legend className="personheader" style={{fontSize: '16px'}}>{item.OUName}</legend>
                                    <Radio.Group className="person-radio" name="person" onChange={handleChange} value={person}>
                                        {
                                            item.userList.map((child,childIndex)=>{
                                                return(
                                                    <Radio value={child.userName} key={childIndex} loginName = {child.loginName} userID = {child.userID}>{child.userName}</Radio>
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

export default LoginNameSelect
