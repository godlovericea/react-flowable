// 自定义Form Render组件,人员选择器
import React from 'react';
import { Modal, Button, Radio, Input, Table, Space } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { GetAccountConfigInfo, GetAccountPageList } from '../../apis/process';
import './TableAccount.less';
const { Column } = Table;
const { Search } = Input;

class TableAccount extends React.Component {
    state={
        visible: false,
        columns: [],
        tableData: [],
        tableAccountValue: '',
        searchVal: '',
        rowSelection: {
            onChange: (selectedRowKeys) => {
                this.setState({
                    tableAccountValue: selectedRowKeys
                })
                // let input = document.getElementById("tableAccountInput")
                // input.value = selectedRowKeys
            }
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = () => {
        let arr1 = this.props.name.split('.')
        let accountName = arr1[0]
        let rowkey = ""
        if (arr1[1].inedxOf('|')> -1) {
            let keyArr = arr1[1].split('|')
            rowkey = keyArr[0]
        } else {
            rowkey = arr1[1]
        }
        let info = this.state.searchVal || ''
        // let accountName = '项目信息台账简略版'
        // let info = this.state.searchVal || ''
        // let rowkey = '项目流水号'
        GetAccountConfigInfo(accountName)
            .then((res) => {
                let colArr = []
                let arr = res.data.getMe[0].WebShowFieldGroup.split(',')
                arr.forEach(item => {
                    if (!item) {
                        return
                    }
                    colArr.push({
                        key: (new Date()).getTime(),
                        title: item,
                        dataIndex: item,
                    })
                })
                this.setState({
                    columns: colArr
                },()=>{
                    GetAccountPageList(1, 2000, accountName, info)
                    .then((response) => {
                        let arrWrap = []
                        response.data.getMe.forEach(async (item) => {
                            let obj = this.hanldeItem(item)
                            obj.key = obj[rowkey]
                            arrWrap.push(obj)
                        })
                        this.setState({
                            tableData: arrWrap
                        })
                    })
                })
            })
    }

    hanldeItem = (obj) => {
        const dataObj = obj
        let objarr = []
        let objobj = {}
        dataObj.WebRow.forEach((item) => {
            objarr.push(item.FieldValue)
        })
        for (let i = 0; i < this.state.columns.length; i++) {
            for (let j = 0; j < objarr.length; j++) {
                if (i === j) {
                    objobj[this.state.columns[i].dataIndex] = objarr[j]
                }
            }
        }
        return objobj
    }
    hanldeInputClick = (e) => {
        this.setState({
            visible: true
        })
    }
    onOk = () => {
        this.setState({
            visible: false
        },()=>{
            this.props.onChange(this.props.name, this.state.tableAccountValue)
        })
    }
    onCancel = () => {
        this.setState({
            visible: false
        })
    }
    onSearch = (val) => {
        this.setState({
            searchVal: val
        },()=>{
            this.getData()
        })
    }
    hanldeInputChange=(e)=>{
        console.log(e)
    }
    render() {
        return (
            <div className="tableAccount-wrapper">
                <div>
                    <span className="keyclass">{this.state.tableAccountValue}</span>
                    <Button type="primary" size="small" shape="round" onClick={this.hanldeInputClick}>台账选择器</Button>
                    {/* <Input type="text" id="tableAccountInput" onChange={this.hanldeInputChange} defaultValue={this.state.tableAccountValue} onClick={this.hanldeInputClick}></Input> */}
                </div>
                <Modal title="流转信息" visible={this.state.visible} onCancel={this.onCancel} onOk={this.onOk} width={900}
                    bodyStyle={{ height: '500px', overflowY: 'auto' }} wrapClassName="personModalClass">
                    <Search
                        placeholder="请输入姓名"
                        allowClear
                        onSearch={this.onSearch}
                        enterButton
                    />
                    <Table
                        rowSelection={{
                            type: 'radio',
                            ...this.state.rowSelection,
                        }}
                        columns={this.state.columns}
                        dataSource={this.state.tableData}
                        rowClassName="rowClassName" style={{ width: '100%' }}>
                    </Table>
                </Modal>
            </div>
        )
    }

}

export default TableAccount
