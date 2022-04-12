import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { baseurl } from '@/settings'

// create an axios instance
const service = axios.create({
  baseURL: baseurl,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['Access-Control-Allow-Origin'] = '*'

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'jwt ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor

service.interceptors.response.use(
  response => {
    const status = response.status
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (status >= 400 && status < 500) {
      Message({
        message: res.detail || 'warning',
        type: 'warning',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.detail || 'warning'))
    } else if (status >= 500) {
      Message({
        message: res.detail || 'error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.detail || 'Error'))
    } else {
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
