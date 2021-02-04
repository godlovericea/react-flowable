import React from 'react';
import Generator from 'fr-generator';
import { CreateModel } from '../../apis/process'
// import FormTransfer from '../../libs/transform/transform'

const defaultValue = {
  schema: {
    type: 'object',
    properties: {
      inputName: {
        title: '简单输入框',
        type: 'string',
      },
    },
  },
  displayType: 'row',
  showDescIcon: true,
  labelWidth: 120,
};

const templates = [
  {
    text: '模板1',
    name: 'something',
    schema: {
      title: '对象',
      description: '这是一个对象类型',
      type: 'object',
      properties: {
        inputName: {
          title: '简单输入框',
          type: 'string',
        },
        selectName: {
          title: '单选',
          type: 'string',
          enum: ['a', 'b', 'c'],
          enumNames: ['早', '中', '晚'],
        },
        dateName: {
          title: '时间选择',
          type: 'string',
          format: 'date',
        },
      },
    },
  },
];

class EditForm extends React.Component{
    constructor(props){
        super(props);
        this.genRef = React.createRef();
        this.extraButtons = [
            true, true, false, true, 
            { 
                text: '保存',
                type: 'primary',
                onClick: () => this.handleScheam()
            }
        ]
    }
    handleScheam = ()=>{
        const FormInfo = this.genRef.current && this.genRef.current.getValue()
        console.log(FormInfo)
        var cookies = document.cookie
        var arr = cookies.split(";")
        var cookieKeyVal = ""
        arr.forEach(item=>{
            if (item.indexOf("FLOWABLE_REMEMBER_ME") > 0) {
                cookieKeyVal  = item
            }
        })
        var cookie = cookieKeyVal.split("=")[1]
        const params = {
            FormInfo,
            description:"",
            key:"",
            modelType:0,
            name:""
        }
        CreateModel(cookie,params)
        .then(res=>{
            alert("新增成功")
        })
    }
    render(){
        return(
            <div style={{ height: '100vh' }}>
                <Generator ref={this.genRef} defaultValue={defaultValue} templates={templates} extraButtons={this.extraButtons}/>
            </div>
        )
    }
}

export default EditForm;
