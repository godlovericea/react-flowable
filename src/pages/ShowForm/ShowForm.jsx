import React, { useState, useRef } from 'react';
import FormRender from 'form-render/lib/antd';
import { Button } from 'antd';
// import schema from '../../json/schema.json';

const schema = {
    "schema": {
      "type": "object",
      "properties": {
        "inputName": {
          "title": "简单输入框",
          "type": "string"
        },
        "textarea_r6eO40": {
          "title": "编辑框",
          "type": "string",
          "format": "textarea"
        },
        "input_hjoN-g": {
          "title": "输入框",
          "type": "string"
        },
        "switch_0tHmO-": {
          "title": "是否选择",
          "type": "boolean",
          "ui:widget": "switch"
        },
        "radio_c5CUWq": {
          "title": "单选",
          "type": "string",
          "enum": [
            "a",
            "b",
            "c"
          ],
          "enumNames": [
            "早",
            "中",
            "晚"
          ],
          "ui:widget": "radio"
        },
        "checkboxes_uRVKRd": {
          "title": "多选",
          "description": "点击多选",
          "type": "array",
          "items": {
            "type": "string"
          },
          "enum": [
            "A",
            "B",
            "C",
            "D"
          ],
          "enumNames": [
            "杭州",
            "武汉",
            "湖州",
            "贵阳"
          ]
        }
      },
      "ui:displayType": "row",
      "ui:showDescIcon": true
    },
    "displayType": "row",
    "showDescIcon": true
}

const ShowForm = () => {
  const [formData, setFormData] = useState({});
  const formRef = useRef();

  const handleSubmit = () => {
    alert(JSON.stringify(formData, null, 2));
  };

  const handleClick = () => {
    formRef.current.resetData({}).then(res => {
      alert(JSON.stringify(res, null, 2));
    });
  };

  return (
    <div style={{ width: 400 }}>
      <FormRender
        ref={formRef}
        {...schema}
        formData={formData}
        onChange={setFormData}
      />
      <Button style={{ marginRight: 12 }} onClick={handleClick}>
        重置
      </Button>
      <Button type="primary" onClick={handleSubmit}>
        提交
      </Button>
    </div>
  );
};

export default ShowForm;