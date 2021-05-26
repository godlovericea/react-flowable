import axios from 'axios'
import webConfig from './config'

// 创建axios 实例
const service = axios.create({
    baseURL: webConfig.baseURL, // api的base_url
    timeout: webConfig.timeout // 请求超时时间
})

// response 拦截器
// service.interceptors.response.use(
//     (response) => {
//         const res = response.data
//         if (res && res.say== 50000) {
//             message.error('身份信息已过期，请重新登录')
//             return false
//         }
//         return res
//     },
//     (error) => {
//         message.error(error.msg || '网络超时，请稍后重试')
//         // loading - 1
//         return Promise.reject(error)
//     }
// )

export default service
