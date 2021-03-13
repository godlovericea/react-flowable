import React from 'react'
import {getSelectName} from '../../apis/process'
import { TreeSelect } from 'antd';

class Demo extends React.Component {
    state = {
        routeParams: '所在分公司.所在大区',
        value: undefined,
        treeData: [],
    };

    genTreeNode = (parentId, id, title, isLeaf = false) => {
        return {
            id,
            pId: parentId,
            title,
            isLeaf,
        };
    };

    onLoadData = treeNode =>
        new Promise(resolve => {
            let routeArr= this.state.routeParams.split('.')
            const { id } = treeNode.props;
            let len = treeNode.pos.split('-')
            let clickIndex = len.length - 1
            console.log(treeNode)
            getSelectName(routeArr[clickIndex])
            .then((res)=>{
                res.data.forEach((item)=>{
                    if (item.NODENAME === treeNode.value) {
                        this.setState({
                            treeData: this.state.treeData.concat([
                                this.genTreeNode(id, item.NODEVALUE, item.NODEVALUE)
                            ])
                        })
                    }
                })
                resolve();
            })
        });

    onChange = value => {
        console.log(value);
        this.setState({ value });
        this.props.onChange(this.props.name, value)
    };
    getFirstNode=()=>{
        let arr = this.state.routeParams.split('.')
        getSelectName(arr[0])
        .then((res)=>{
            let firArr = []
            res.data.forEach((item)=>{
                firArr.push({
                    id: item.NODEVALUE, pId: 0, value: item.NODEVALUE, title: item.NODENAME, isLeaf: false
                })
            })
            this.setState({
                treeData: firArr
            })
        })
    }
    componentDidMount(){
        this.getFirstNode()
    }

    render() {
        const { treeData } = this.state;
        return (
            <TreeSelect
                treeDataSimpleMode
                style={{ width: '100%' }}
                value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                onChange={this.onChange}
                loadData={this.onLoadData}
                treeData={treeData}
            />
        );
    }
}

export default Demo