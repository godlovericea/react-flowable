// 产品信息组件
import React, {useState, useEffect} from 'react'
import { GetProduct, GetProductBusiness } from '../../apis/process'
import { InputNumber, Modal, Button } from 'antd'
import "./ProductInfo.less"

const ProductInfo =(props)=>{
    const [proVisible, setProVisible] = useState(false) // 是否显示Modal
    const [productList, setProductList] = useState([]) // 产品列表 
    const [copyProductList, setCopyProductList] = useState([]) // 复制的产品列表数据
    const [addedProduct, setAddedProduct] = useState([]) // 已经添加的数据

    // 拉取数据
    const getData=()=>{
        GetProduct()
        .then((res)=>{
            // 初始化Number和Price两个值，便于操作
            res.data.getMe.map((item)=>{
                item.Productes.map(cItem=>{
                    cItem.Number = 0
                    cItem.Price = 0
                })
            })
            setProductList(res.data.getMe)
            setCopyProductList(res.data.getMe)
        })
    }

    // 获取产品列表
    const getProductList =()=>{
        GetProductBusiness(props.taskId)
        .then((res)=>{
            // console.log(res.data)
            const arr = res.data.getMe
            // 拉取去重后的分组的名称
            const newArr = [...new Set(arr.map(i => i.ProductTypes))]; // 去重的时候需要注意和普通数组不同
            let list = [];
            // 筛选去重后的数组，并push对象到list
            newArr.forEach(i => {
                list.push(arr.filter(t => t.ProductTypes === i));
            })
            let mlist = [];
            // 遍历list数组，讲分组的数据迭代到新的数组，形成需要的格式
            list.forEach((item, index) => {
                const obj = {
                    ProductType: newArr[index],
                    Productes: []
                }
                item.forEach((el)=>{
                    obj.Productes.push({
                        ProductNames: el.ProductName,
                        Number: el.Number,
                        Price: el.ProductPrice
                    })
                })
                mlist.push(obj)
            })
            setAddedProduct(mlist)
        })
    }

    const openMadal=()=>{
        setProVisible(true)
    }

    const addProduct=()=>{
        let arr = []
        productList.map((item)=>{
            let obj = {
                ProductType: item.ProductType,
                Productes: []
            }
            // 数量和价格只要有一个大于0，则为有效数据，添加到数组中
            item.Productes.map(cItem=>{
                if (cItem.Number > 0 || cItem.Price > 0) {
                    obj.Productes.push(cItem)
                }
            })
            if (obj.Productes.length > 0) {
                arr.push(obj)
            }
        })
        setAddedProduct(arr)
        setProVisible(false)
        
        let arrList = []
        arr.forEach((item)=>{
            let myObj = {
                ProductType: item.ProductType,
                ProductDetails: []
            }
            item.Productes.forEach((cItem)=>{
                
                myObj.ProductDetails.push({
                    ProductName: cItem.ProductNames,
                    ProductCode: cItem.ProductCode,
                    Price: cItem.Price,
                    Number: cItem.Number || 0 + ""
                })
            })
            arrList.push(myObj)
        })
        props.getProductInfo(arrList);
    }

    const closeModal=()=>{
        setProVisible(false)
    }

    const productNumberOnChange=(value, type, name, code)=>{
        copyProductList.map((item)=>{
            item.Productes.map(cItem=>{
                if (code === cItem.ProductCode) {
                    cItem.Number = value
                }
            })
        })
        setProductList(copyProductList)
    }
    
    const productPriceOnChange=(value, type, name, code)=>{
        copyProductList.map((item)=>{
            item.Productes.map(cItem=>{
                if (code === cItem.ProductCode) {
                    cItem.Price = value
                }
            })
        })
        setProductList(copyProductList)
    }

    useEffect(()=>{
        console.log(props, "props")
        getData()
        getProductList()
    }, [])


    return(
        <div className="productInfo-wrapper">
            <div className="productinfo-title">
                产品信息
            </div>
            {
                props.showAddProductButton ?
                <div className="topbtns">
                    <Button type="primary" onClick={openMadal}>添加产品</Button>
                </div>
                :
                null
            }
            <div className="productInfo-header">
                <div className="header-title">产品类型</div>
                <div className="header-title">产品名称</div>
                <div className="header-title">数量</div>
                <div className="header-title">价格（万元）</div>
            </div>
            {
                addedProduct.length > 0 ?
                <div className="productInfo-content">
                {
                    addedProduct.map((item,index)=>{
                        return (
                            <div className="product-rows" key={index}>
                                <div className="first-column">
                                    {item.ProductType}
                                </div>
                                <div className="other-column">
                                    {
                                        item.Productes.map((cItem,cIndex)=>{
                                            return(
                                                <div className="normal-column" key={cIndex}>
                                                    <div className="product-name">{cItem.ProductNames}</div>
                                                    <div className="product-name">
                                                        {cItem.Number}
                                                    </div>
                                                    <div className="product-name">
                                                        {cItem.Price}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                
                            </div>
                        )
                    })
                }
                </div>
                :
                <div className="product-nodata">
                    暂无数据
                </div>
            }
            <Modal title="添加产品信息" visible={proVisible} onOk={addProduct} onCancel={closeModal} width={1008}
            bodyStyle={{overflow:'auto'}} wrapClassName="product-wrapper">
                <div className="modal-productInfo-header">
                    <div className="modal-header-title">产品类型</div>
                    <div className="modal-header-product">产品名称</div>
                    <div className="modal-header-product">数量</div>
                    <div className="modal-header-product">价格（万元）</div>
                </div>
                <div className="productInfo-content">
                {
                    productList.map((item,index)=>{
                        return (
                            <div className="product-rows" key={index}>
                                <div className="first-column">
                                    {item.ProductType}
                                </div>
                                <div className="other-column">
                                    {
                                        item.Productes.map((cItem,cIndex)=>{
                                            return(
                                                <div className="normal-column" key={cIndex}>
                                                    <div className="product-name">{cItem.ProductNames}</div>
                                                    <div className="product-name">
                                                        <InputNumber size="small" min={0} max={99999} defaultValue={cItem.Number} onChange={value => productNumberOnChange(value,item.ProductType, cItem.ProductNames, cItem.ProductCode)} />
                                                    </div>
                                                    <div className="product-name">
                                                        <InputNumber size="small" min={0} max={99999} defaultValue={cItem.Price} onChange={value=> productPriceOnChange(value,item.ProductType, cItem.ProductNames, cItem.ProductCode)} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                
                            </div>
                        )
                    })
                }
                </div>
            </Modal>
        </div>
    )
}

export default ProductInfo