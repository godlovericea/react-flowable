// 自定义FormRender组件——台账选择器
import React from 'react';
import { Modal, Button, Input, Table, message, Tooltip } from 'antd';
import { GetTZInfo } from '../../apis/process';
import './TableAccount.less';
const { Search } = Input;

class TableAccount extends React.Component {
    state={
        visible: false,
        pagination:{
            size: 'small'
        },
        columns: [
            {
                title: '序号',
                dataIndex: 'Index'
            },
            {
                title: '台账名称',
                dataIndex: 'Name'
            },
            {
                title: '台账表名',
                dataIndex: 'TableName'
            },
            {
                title: '所属分组',
                dataIndex: 'GroupName'
            }
        ],
        tableData: [],
        tableAccountValue: this.props.options && this.props.options.value || "",
        rowSelection: {
            onChange: (selectedRowKeys) => {
                this.setState({
                    tableAccountValue: selectedRowKeys[0]
                })
            }
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = (name = "") => {
        GetTZInfo(name)
            .then((res) => {
                if (res.data.say.statusCode !== "0000") {
                    message.error(res.data.say.errMsg)
                    return
                }
                res.data.getMe.forEach((item,index)=>{
                    item.Index = index + 1
                    item.key = item.Name
                })
                this.setState({
                    tableData: res.data.getMe
                })
            })
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
        this.getData(val)
    }
    render() {
        return (
            <div className="tableAccount-wrapper">
                <div>
                    <span className="keyclass">{this.state.tableAccountValue}</span>
                    <Tooltip title="请点击选择台账" placement="right">
                        <Button type="primary" shape="round" size="small" onClick={this.hanldeInputClick}>台账选择器</Button>
                    </Tooltip>
                </div>
                <Modal title="选择台账" visible={this.state.visible} onCancel={this.onCancel} onOk={this.onOk} width={900}
                    bodyStyle={{ height: '500px', overflowY: 'auto' }} wrapClassName="personModalClass">
                    <Search
                        placeholder="请输入台账名称"
                        allowClear
                        onSearch={this.onSearch}
                        enterButton
                    />
                    <Table
                        rowSelection={{
                            type: 'radio',
                            ...this.state.rowSelection,
                        }}
                        pagination={this.state.pagination}
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
