// 自定义FormRender组件——台账选择器
import React from 'react';
import { Modal, Button, Input, Table, message, Tooltip } from 'antd';
import { GetAccountPageList } from '../../apis/process';
import './TableAccount.less';
const { Search } = Input;

class TableAccount extends React.Component {
    state={
        modalTitle: '',
        visible: false,
        pagination:{
            hideOnSinglePage: false,
            pageSizeOptions: [20,30,50],
            showQuickJumper: true,
            size: 'small',
            pageSize: 10
        },
        columns: [],
        tableData: [],
        tableAccountValue: this.props.options && this.props.options.value || "",
        rowSelection: {
            onChange: (selectedRowKeys) => {
                // console.log(selectedRowKeys)
                // console.log(this.state.tableData)
                let value = ""
                this.state.tableData.forEach((item)=>{
                    if (item.ID === selectedRowKeys[0]) {
                        if (this.props.options.accValue ) {
                            value = item[this.props.options.accValue]
                        } else if (this.props.schema.accValue) {
                            value = item[this.props.schema.accValue]
                        } else {
                            message.error("台账选择器配置有误！")
                        }
                    }
                })
                this.setState({
                    tableAccountValue: value
                })
            }
        }
    }
    componentDidMount(){
        // console.log(this.props)
        if (this.props.options.accName) {
            this.setState({
                modalTitle: this.props.options.accName
            })
            this.getData(this.props.options.accName)
        } else if (this.props.schema.accName && this.props.schema.accValue) {
            this.setState({
                modalTitle: this.props.schema.accName
            })
            this.getData(this.props.schema.accName)
        } else {
            message.error("台账选择器配置有误！")
        }
        
        // this.getData('销售合同简略版')
    }
    getData = (name = "", info = "") => {
        GetAccountPageList(name, info)
            .then((res) => {
                if (res.data.say.statusCode !== "0000") {
                    message.error(res.data.say.errMsg)
                    return
                }
                let resArr = []
                res.data.getMe.forEach((item, index)=>{
                    let obj = {
                        '序号': index + 1,
                        ID: item.ID
                    }
                    item.WebRow.forEach((cItem)=>{
                        let key = cItem.FieldName
                        let value = cItem.FieldValue
                        obj[key] = value
                    }) 
                    resArr.push(obj)
                })
                resArr.forEach((item)=>{
                    // if (this.props.options.accValue) {
                    //     item.key = item[this.props.options.accValue]
                    // } else if (this.props.schema.accValue) {
                    //     item.key = item[this.props.schema.accValue]
                    // } else {
                    //     message.error("台账选择器配置有误！")
                    // }
                    item.key = item.ID
                })
                let columnArr = []
                for(let key in resArr[0]) {
                    if (key === 'key' || key === "ID") {
                        continue
                    }
                    columnArr.push({
                        title: key,
                        dataIndex: key
                    })
                }
                this.setState({
                    columns: columnArr,
                    tableData: resArr
                })
            })
    }

    hanldeInputClick = () => {
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
        this.getData(this.props.options.accName, val)
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
                <Modal title={this.state.modalTitle} visible={this.state.visible} onCancel={this.onCancel} onOk={this.onOk} width={1360}
                    bodyStyle={{ height: '600px', overflowY: 'auto' }} wrapClassName="personModalClass">
                    <Search
                        placeholder="请输入名称"
                        allowClear
                        onSearch={this.onSearch}
                        enterButton
                        className="tableAccountSearchClass"
                    />
                    <Table
                        className="tableAccountTableClass"
                        rowSelection={{
                            type: 'radio',
                            ...this.state.rowSelection,
                        }}
                        scroll = {{x:700,y:400}}
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
