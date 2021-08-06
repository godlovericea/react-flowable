// 表单编辑器自定义组件配置文件
import { defaultSettings } from 'fr-generator';
const customizeSetting = {
    title: '自定义组件',
    widgets: [{
            text: '附件上传',
            name: 'uploadFile',
            schema: {
                title: '附件上传',
                type: 'string',
                'ui:widget': 'file',
            },
            widget: 'file',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '人员选择器',
            name: 'StaffSelectWidget',
            schema: {
                title: '人员选择器',
                type: 'string',
                'ui:widget': 'staff',
            },
            widget: 'staff',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '台账选择器',
            name: 'TableAccount',
            schema: {
                title: '台账选择器',
                type: 'string',
                'ui:widget': 'TableAccount'
            },
            widget: 'TableAccount',
            setting: {
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                },
                accName: {
                    title: "台账名称",
                    type: 'string'
                },
                accValue: {
                    title: "取值字段名称",
                    type: 'string'
                }
            },
        },
        {
            text: '可编辑值选择器',
            name: 'EditbleSelct',
            schema: {
                title: '可编辑值选择器',
                type: 'string',
                'ui:widget': 'editSearch',
            },
            widget: 'editSearch',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '搜索选择器',
            name: 'SearchSelect',
            schema: {
                title: '搜索选择器',
                type: 'string',
                'ui:widget': 'search',
            },
            widget: 'search',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '级联选择器',
            name: 'TreeCascader',
            schema: {
                title: '级联选择器',
                type: 'string',
                'ui:widget': 'cascader',
            },
            widget: 'cascader',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '城市选择器',
            name: 'cityPicker',
            schema: {
                title: '城市选择器',
                type: 'string',
                'ui:widget': 'cityPicker',
            },
            widget: 'cityPicker',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '坐标控件',
            name: 'mapSelect',
            schema: {
                title: '坐标控件',
                type: 'string',
                'ui:widget': 'mapSelect',
            },
            widget: 'mapSelect',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '自定义多选',
            name: 'customizeMultiSelect',
            schema: {
                title: '自定义多选',
                type: 'string',
                'ui:widget': 'customizeMultiSelect',
            },
            widget: 'customizeMultiSelect',
            setting: {
                fieldData: {
                    title: "数据字典",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
        {
            text: '编码生成器',
            name: 'CodeGenerator',
            schema: {
                title: '编码生成器',
                type: 'string',
                'ui:widget': 'CodeGenerator',
            },
            widget: 'CodeGenerator',
            setting: {
                code: {
                    title: "编码前缀",
                    type: 'string'
                },
                isRequired: {
                    title: '必填',
                    type: 'boolean'
                }
            },
        },
    ],
}

// 添加校验正则
const validArr = [
    {
        validName: '无校验规则',
        validReg: ''
    },
    {
        validName: '数字',
        validReg: '^(\-|\+)?\d+(\.\d+)?$'
    },
    {
        validName: '非负整数',
        validReg: '^(0|[1-9][0-9]*)$'
    },
    {
        validName: '英文或数字',
        validReg: '^[A-Za-z0-9]+$'
    },
    {
        validName: '邮箱',
        validReg: '^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$'
    },
    {
        validName: '手机号码',
        validReg: '^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$'
    },
    {
        validName: '身份证号',
        validReg: '(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)'
    },
    {
        validName: 'IPv4地址',
        validReg: '((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}'
    },
    {
        validName: '邮政编码',
        validReg: '[1-9]\d{5}(?!\d)'
    }
]

// 处理正则校验
defaultSettings.forEach((item)=>{
    if (item.title === "基础组件") {
        item.widgets.forEach((cItem)=>{
            if (cItem.setting.hasOwnProperty('pattern')){
                let namesArr = []
                let valArr = []
                cItem.setting.pattern['ui:options'].placeholder = "请选择校验规则"
                for(let i=0; i<validArr.length;i++) {
                    namesArr.push(validArr[i].validName)
                    valArr.push(validArr[i].validReg)
                }
                cItem.setting.pattern.enumNames = namesArr
                cItem.setting.pattern.enum = valArr

            }
        })
    }
})

defaultSettings.forEach((item) => {
    item.widgets.forEach((cItem) => {
        cItem.setting = {
            ...cItem.setting,
            fieldData: {
                title: "数据字典",
                type: 'string'
            },
            isRequired: {
                title: '必填',
                type: 'boolean'
            }
        }
    })
})

let settings = defaultSettings.push(customizeSetting)

export default settings