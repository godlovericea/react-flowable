// 自定义FR-Generator组件——台账选择器——查询所有台账
import React from 'react';
import { Modal, Button, Input, Table, message } from 'antd';
import { GetTZInfo } from '../../apis/process';
const { Search } = Input;

class LedgerAccount extends React.Component {
    state={
        visible: false,
        columns: [],
        tableData: [],
        tableAccountValue: this.props.options && this.props.options.value || "",
        searchVal: '',
        rowSelection: {
            onChange: (selectedRowKeys) => {
                this.setState({
                    tableAccountValue: selectedRowKeys
                })
            }
        }
    }
    componentDidMount(){
        this.getData()
    }
    getData = async() => {
        let result = await GetTZInfo()
        // console.log(result.data.root)
        const columnsArr = [
            {
              title: '台账名称',
              dataIndex: 'name'
            }
        ];
        let dataArr = []
        result.data.root.forEach((item)=>{
            dataArr.push({
                key: item.ID,
                name: item.name
            })
        })
        
        this.setState({
            columns: columnsArr,
            tableData: dataArr
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
        this.setState({
            searchVal: val
        },()=>{
            this.getData()
        })
    }
    hanldeInputChange=(e)=>{
        // console.log(e)
    }
    render() {
        return (
            <div className="tableAccount-wrapper">
                <div>
                    <span className="keyclass">{this.state.tableAccountValue}</span>
                    <Button type="primary" size="small" shape="round" onClick={this.hanldeInputClick}>台账选择器</Button>
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
                        columns={this.state.columns}
                        dataSource={this.state.tableData}
                        rowClassName="rowClassName" style={{ width: '100%' }}>
                    </Table>
                </Modal>
            </div>
        )
    }

}

export default LedgerAccount
