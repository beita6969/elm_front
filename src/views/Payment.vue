<template>
	<div class="wrapper">

		<header>
			<p>支付订单</p>
		</header>


		<div class="order-info" v-if="orderInfo">
			<div class="business-info">
				<h3>{{ orderInfo.business.businessName }}（云南大学店）</h3>
			</div>


			<div class="delivery-info">
				<h3>配送信息</h3>
				<div class="address">
					<p>{{ orderInfo.deliveryAddress.contactName }} {{ orderInfo.deliveryAddress.contactTel }}</p>
					<p>{{ orderInfo.deliveryAddress.address }}</p>
				</div>
			</div>


			<div class="food-list">
				<h3>商品信息</h3>
				<ul>
					<li v-for="item in orderInfo.cartList" :key="item.foodId">
						<span class="name">{{ item.foodName }}</span>
						<span class="quantity">x{{ item.quantity }}</span>
						<span class="price">￥{{ (item.foodPrice * item.quantity).toFixed(2) }}</span>
					</li>
				</ul>
			</div>


			<div class="total-price">
				<p>总计：<span>￥{{ orderInfo.totalPrice.toFixed(2) }}</span></p>
			</div>
		</div>


		<div class="pay-btn">
			<button @click="confirmPayment">确认支付</button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { getSessionStorage } from '@/common'
import qs from 'qs'

const router = useRouter()
const axios = inject('axios')
const orderInfo = ref(null)

onMounted(() => {

	const info = getSessionStorage('orderInfo')
	if (!info) {
		alert('订单信息不存在')
		router.push('/')
		return
	}
	orderInfo.value = info
})


const confirmPayment = async () => {
	try {
		const user = getSessionStorage('user')
		if (!user) {
			alert('请先登录')
			router.push('/login')
			return
		}


		const orderData = {
			userId: user.userId,
			businessId: orderInfo.value.business.businessId,
			orderTotal: Number(orderInfo.value.totalPrice),
			daId: Number(orderInfo.value.deliveryAddress.daId),
			orderDate: new Date().toISOString().split('T')[0],
			orderState: 1
		}

		console.log('发送的订单数据:', orderData)


		const orderResponse = await axios.post('OrderController/createOrders', 
			orderData, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
		
		if (orderResponse.data > 0) {
			const orderId = orderResponse.data


			const detailList = orderInfo.value.cartList.map(item => ({
				orderId: orderId,
				foodId: Number(item.foodId),
				quantity: Number(item.quantity)
			}))


			await axios.post('OrderDetailController/saveOrderDetailetBatch', 
				detailList, {
				headers: {
					'Content-Type': 'application/json'
				}
			})


			await axios.post('CartController/removeCart', qs.stringify({
				userId: user.userId,
				businessId: Number(orderInfo.value.business.businessId)
			}))


			sessionStorage.removeItem('orderInfo')
			sessionStorage.removeItem('cartList')

			alert('支付成功！')
			router.push({
				path: '/orderList',
				query: { refresh: 'true', timestamp: Date.now() }
			})
		} else {
			throw new Error('创建订单失败')
		}
	} catch (error) {
		console.error('支付失败:', error)
		console.error('错误详情:', error.response?.data)
		alert('支付失败，请重试')
	}
}
</script>

<style scoped>
.wrapper {
	width: 100%;
	height: 100%;
	background-color: #f5f5f5;
}

header {
	width: 100%;
	height: 12vw;
	background-color: #0097FF;
	color: #fff;
	font-size: 4.8vw;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
}

.order-info {
	margin-top: 12vw;
	padding-bottom: 14vw;
}

.business-info,
.delivery-info,
.food-list {
	background-color: #fff;
	margin-bottom: 2vw;
	padding: 3vw;
}

.business-info h3 {
	font-size: 4.5vw;
	color: #333;
}

.delivery-info h3,
.food-list h3 {
	font-size: 4vw;
	color: #333;
	margin-bottom: 2vw;
}

.address p {
	font-size: 3.5vw;
	color: #666;
	line-height: 1.5;
}

.food-list ul li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2vw 0;
	font-size: 3.5vw;
}

.food-list .name {
	flex: 1;
	color: #333;
}

.food-list .quantity {
	color: #666;
	margin: 0 3vw;
}

.food-list .price {
	color: #f00;
	font-weight: bold;
}

.total-price {
	background-color: #fff;
	padding: 3vw;
	text-align: right;
	font-size: 4vw;
}

.total-price span {
	color: #f00;
	font-weight: bold;
}

.pay-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 3vw;
	box-sizing: border-box;
	background-color: #fff;
}

.pay-btn button {
	width: 100%;
	height: 10vw;
	background-color: #38CA73;
	color: #fff;
	border: none;
	border-radius: 4px;
	font-size: 4vw;
}
</style>