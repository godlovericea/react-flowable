import axios from 'axios'
import webConfig from './config'

// 创建axios 实例
const service = axios.create({
    baseURL: webConfig.baseURL, // api的base_url
    timeout: webConfig.timeout // 请求超时时间
})

// console.log(getStorage('token'))
// request 拦截器
// service.interceptors.request.use(
//     (config) => {
//         // 这里可以自定义一些config 配置

//         if (getStorage('token')) {
//             config.headers.Authorization = 'Bearer ' + getStorage('token')
//         }

//         // loading + 1
//         store.dispatch('app/setLoading', true)

//         return config
//     },
//     (error) => {
//         //  这里处理一些请求出错的情况

//         // loading 清 0
//         store.dispatch('app/setLoading', 0)

//         return Promise.reject(error)
//     }
// )

// // response 拦截器
// service.interceptors.response.use(
//     (response) => {
//         const res = response.data
//         if (res.code === 50000) {
//             // Message({
//             //     message: '身份信息已过期，请重新登录',
//             //     type: 'error',
//             //     duration: 2 * 1000
//             // })
//             message.error('身份信息已过期，请重新登录')
//             clearStorage()
//             router.push('/login')
//             router.go(0)
//             return false
//         }
//         if (res.code === 50002) {
//             // Message({
//             //     message: '请登录',
//             //     type: 'error',
//             //     duration: 2 * 1000
//             // })
//             message.error('请登录')
//             clearStorage()
//             router.push('/login')
//             setTimeout(() => {
//                 router.go(0)
//             }, 1000)
//             return false
//         }
//         if (res.code !== 200) {
//             // Message({
//             //     message: res.msg || '网络超时，请稍后重试',
//             //     type: 'error',
//             //     duration: 2 * 1000
//             // })
//             message.error(res.msg || '网络超时，请稍后重试')
//         }
//         // 这里处理一些response 正常放回时的逻辑

//         // loading - 1
//         store.dispatch('app/setLoading', false)

//         return res
//     },
//     (error) => {
//         // 这里处理一些response 出错时的逻辑
//         // Message({
//         //     message: error.msg || '网络超时，请稍后重试',
//         //     type: 'error',
//         //     duration: 2 * 1000
//         // })
//         message.error(error.msg || '网络超时，请稍后重试')
//         // loading - 1
//         store.dispatch('app/setLoading', false)

//         return Promise.reject(error)
//     }
// )

export default service
