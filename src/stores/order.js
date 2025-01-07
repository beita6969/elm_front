import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSessionStorage } from '@/common'
import axios from '@/plugins/axios'

export const useOrderStore = defineStore('order', () => {
    const orderPaidArr = ref([])
    const orderUnpaidArr = ref([])
    
    const fetchOrders = async () => {
        try {
            const user = getSessionStorage('user')
            if (!user) {
                router.push('/login')
                return
            }
            
            const { data } = await axios.post('OrderController/listOrdersByUserId', {
                userId: user.userId
            })
            
            
            orderPaidArr.value = []
            orderUnpaidArr.value = []
            
            
            data.forEach(order => {
                const newOrder = { ...order, isShowDetailet: false }
                if (order.orderState === 1) {
                    orderPaidArr.value.push(newOrder)
                } else {
                    orderUnpaidArr.value.push(newOrder)
                }
            })
        } catch (error) {
            console.error('获取订单列表失败:', error)
        }
    }
    
    return {
        orderPaidArr,
        orderUnpaidArr,
        fetchOrders
    }
}) 