import React, { useState } from 'react';
import Generator, {
    defaultSettings,
    defaultCommonSettings,
    defaultGlobalSettings,
} from 'fr-generator';
import UploadFile from '../../components/UploadFile/UploadFile'

const NewWidget = ({ value = 0, onChange }) => (
    <button onClick={() => onChange(value + 1)}>{value}</button>
);


// console.log(Object.prototype.toString.call(NewWidget))
// console.log(Object.prototype.toString.call(UploadFile))


const customizeSetting = {
    title: '自定义组件',
    widgets: [
        {
            text: '服务端下拉选框',
            name: 'asyncSelect',
            schema: {
                title: '来自服务端',
                type: 'string',
                'ui:widget': 'file',
            },
            widget: 'file',
            setting: {
                api: { title: 'api', type: 'string' },
            },
        },
        {
            text: 'object',
            name: 'object',
            schema: {
                title: '对象',
                type: 'object',
                properties: {},
            },
            widget: 'map',
            setting: {},
        },
        {
            text: '姓名',
            name: 'name',
            schema: {
                title: '输入框',
                type: 'string',
            },
            setting: {
                maxLength: { title: '最长字数', type: 'number' },
            },
        },
    ],
}

const Demo = () => {

    const settings = defaultSettings.push(customizeSetting)

    // console.log(defaultSettings, "defaultSettings");
    // console.log(defaultCommonSettings, "defaultCommonSettings");



    return (
        <div style={{ height: '100vh' }}>
            <Generator
                widgets={{ file: UploadFile }}
                settings = {settings}
            />
        </div>
    );
};

export default Demo;
