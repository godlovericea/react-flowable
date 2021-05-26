// FormRender组件库

import TreeCascader from '../../components/TreeCascader/TreeCascader' //树形选择器
import StaffSelectWidget from '../../components/StaffSelectWidget/StaffSelectWidget' // 员工选择器
import TableAccount from '../../components/TableAccount/TableAccount' // 表格选择器
import UploadFile from '../../components/UploadFile/UploadFile' // 文件上传
import EditbleSelct from '../../components/EditbleSelct/EditbleSelct' // 可编辑下拉选择器
import SearchSelect from '../../components/SearchSelect/SearchSelect' // 搜索选择器
import AMapContainer from '../../components/AMapContainer/AMapContainer' // 地图坐标选择器
import cityPicker from '../../components/CityPicker/CityPicker' // 城市选择器
import multiSelect from '../../components/MultiSelect/MultiSelect' // 自定义多选（带全选）
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker' // 日期时间选择器
import CodeGenerator from '../../components/CodeGenerator/CodeGenerator' // 编码生成器

const FormRenderWidgets = {
    staff: StaffSelectWidget,
    cascader: TreeCascader,
    search: SearchSelect,
    TableAccount: TableAccount,
    file:UploadFile, 
    editSearch: EditbleSelct,
    mapSelect: AMapContainer,
    cityPicker: cityPicker,
    multiSelect: multiSelect, 
    DateTimePicker:DateTimePicker,
    CodeGenerator: CodeGenerator
}

export default FormRenderWidgets