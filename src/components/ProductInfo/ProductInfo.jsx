import React, {useState, useEffect} from 'react'
import { GetProduct } from '../../apis/process'
import { InputNumber, Modal, Button } from 'antd'
import "./ProductInfo.less"

const ProductInfo =(props)=>{
    const [proVisible, setProVisible] = useState(false)
    const [productList, setProductList] = useState([])
    const [copyProductList, setCopyProductList] = useState([])
    const [addedProduct, setAddedProduct] = useState([])

    const getData=()=>{
        GetProduct()
        .then((res)=>{
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
        // let dataArr =[...arr]
        // dataArr.map((item)=>{
        //     let myObj = {
        //         ProductType: item.ProductType,
        //         ProductDetails: []
        //     }
        //     item.Productes.map(cItem=>{
        //         myObj.ProductDetails.push({
        //             ProductName: cItem.ProductNames,
        //             ProductCode: cItem.ProductCode,
        //             Price: cItem.Price,
        //             Number: cItem.Number || 0 + ""
        //         })
        //     })
        // })
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
        getData()
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