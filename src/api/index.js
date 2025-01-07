import axios from 'axios'
import qs from 'qs'


const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  },
  withCredentials: false
})


request.interceptors.request.use(
  config => {
    console.log('发送请求:', config.url, config.params || config.data)
    
    
    if (config.method === 'post') {
      config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
    } else if (config.method === 'get') {
      config.params = config.params || {}
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)


request.interceptors.response.use(
  response => {
    console.log('收到响应:', response.data)
    return response
  },
  error => {
    console.error('响应错误:', error)
    if (error.message === 'Network Error') {
      console.error('网络错误，请检查：')
      console.error('1. 后端服务是否启动')
      console.error('2. 请求地址是否正确:', error.config.url)
      console.error('3. 是否存在跨域问题')
      console.error('4. 后端服务是否正常响应')
    }
    return Promise.reject(error)
  }
)


export const userApi = {
  login: (params) => request.post('/UserController/getUserByIdByPass', params),
  register: (params) => request.post('/UserController/saveUser', params)
}

export const businessApi = {
  getBusinessList: (params) => request.get('/BusinessController/listBusinessByOrderTypeId', { params }),
  getBusinessById: (params) => request.get('/BusinessController/getBusinessById', { params })
}

export const foodApi = {
  getFoodList: (params) => request.get('/FoodController/listFoodBybussinessId', { params })
}

export const cartApi = {
  saveCart: (params) => request.post('/CartController/saveCart', params),
  updateCart: (params) => request.post('/CartController/updateCart', params),
  removeCart: (params) => request.post('/CartController/removeCart', params),
  getCartList: (params) => request.get('/CartController/listCart', { params })
}

export const addressApi = {
  getAddressList: (params) => request.get('/DeliveryAddressController/listDeliveryAddressByUserId', { params }),
  saveAddress: (params) => request.post('/DeliveryAddressController/saveDeliveryAddress', params),
  updateAddress: (params) => request.post('/DeliveryAddressController/updateDeliveryAddress', params),
  removeAddress: (params) => request.post('/DeliveryAddressController/removeDeliveryAddress', params)
}

export const orderApi = {
  createOrder: (params) => request.post('/OrderController/createOrders', params),
  getOrderById: (params) => request.get('/OrderController/getOrdersByOrderId', { params }),
  getOrdersByUserId: (userId) => request.get('/OrderController/listOrdersByUserId', { params: { userId } })
} 