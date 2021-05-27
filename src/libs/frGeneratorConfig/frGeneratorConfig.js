// 表单编辑器自定义组件配置文件
const customizeSetting = {
  title: '自定义组件',
  widgets: [
      {
          text: '上传组件',
          name: 'uploadFile',
          schema: {
              title: '上传到服务器',
              type: 'string',
              'ui:widget': 'file',
          },
          widget: 'file',
          setting: {
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
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
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
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
              'ui:widget': 'TableAccount',
          },
          widget: 'TableAccount',
          setting: {
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
                  title: '必填',
                  type: 'boolean'
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
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
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
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
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
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
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
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
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
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
                  title: '必填',
                  type: 'boolean'
              }
          },
      },
      {
          text: '自定义多选',
          name: 'multiSelect',
          schema: {
              title: '自定义多选',
              type: 'string',
              'ui:widget': 'multiSelect',
          },
          widget: 'multiSelect',
          setting: {
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
                  title: '必填',
                  type: 'boolean'
              }
          },
      },
      {
          text: '日期时间',
          name: 'DateTimePicker',
          schema: {
              title: '日期时间',
              type: 'string',
              'ui:widget': 'DateTimePicker',
          },
          widget: 'DateTimePicker',
          setting: {
              api:{
                  title: "数据字典",
                  type: 'string'
              },
              isRequired:{
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
              code:{
                  title: "编码前缀",
                  type: 'string'
              },
              isRequired:{
                  title: '必填',
                  type: 'boolean'
              }
          },
      },
  ],
}


export default customizeSetting