import React from 'react';
import FormRender from 'form-render/lib/antd';
import {Button} from 'antd'
import { GetFormJson } from '../../apis/process'
import './ShowForm.less'

class ShowForm extends React.Component{
    constructor(props){
      super(props)
      this.formRef = React.createRef()
      this.state = {
          schema:{}
      }
    }
    componentDidMount(){
        this.getData()
    }
    getData =()=>{
        const id = this.props.location.state.id
        GetFormJson(id)
          .then((res)=>{
              if (res.status === 200) {
                  this.setState({
                      schema: JSON.parse(res.data)
                  })
              }
          })
    }
      setFormData =() =>{
          
      }

      handleSubmit = () => {
        // alert(JSON.stringify(formData, null, 2));
      };

      handleClick = () => {
          // formRef.current.resetData({}).then(res => {
          // alert(JSON.stringify(res, null, 2));
          // });
      };
      goBackToHome=()=>{
        this.props.history.push({
            pathname: '/home'
        })
      }
      render(){
        return (
          <div>
              <FormRender
                  ref={this.formRef}
                  {...this.state.schema}
                  onChange={this.setFormData}
              />
              <div className="backtohome">
                    <Button size="small" className="localBtnClass" type="primary" onClick={this.goBackToHome}>返回列表</Button>
              </div>
          </div>
        );
      }
}

export default ShowForm;