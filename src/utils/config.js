const TIMEOUT = 30000 //超时时间
const DEV_ORIGIN = 'http://localhost:8089' // 本地开发环境请求接口地址
const PRO_ORIGIN = window.location.ancestorOrigins[0] // 线上环境请求接口地址

const webConfig = {
    baseURL: `${PRO_ORIGIN}/CityInterface/rest/services/PandaWorkflow.svc`,// 接口地址
    timeout: TIMEOUT,//超时时间
}

export default webConfig