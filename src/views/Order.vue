<template>
	<div class="wrapper">

		<header>
			<p>确认订单</p>
		</header>


		<div class="order-info">

			<div class="address-section" @click="toSelectAddress">
				<div v-if="deliveryAddress" class="address-info">
					<h3>{{ deliveryAddress.contactName }} {{ deliveryAddress.contactTel }}</h3>
					<p>{{ deliveryAddress.address }}</p>
				</div>
				<div v-else class="no-address">
					<p>点击选择收货地址</p>
				</div>
				<i class="fa fa-angle-right"></i>
			</div>


			<div class="food-info">

				<div v-if="business" class="business-info">
					<h3>{{business.businessName}}（云南大学店）</h3>
				</div>


				<ul v-if="cartList && cartList.length > 0" class="food-list">
					<li v-for="item in cartList" :key="item.foodId">
						<div class="food-item">
							<span class="name">{{ item.foodName }}</span>
							<span class="quantity">x{{ item.quantity }}</span>
							<span class="price">￥{{ (item.foodPrice * item.quantity).toFixed(2) }}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>


		<div class="payment-info">
			<div class="total">
				总计：<span>￥{{ totalPrice.toFixed(2) }}</span>
			</div>
			<div class="pay-button" @click="toPayment">
				<button>去支付</button>
			</div>
		</div>


		<Footer />
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { useRouter } from 'vue-router'
	import { getSessionStorage, setSessionStorage } from '@/common'
	import Footer from '@/components/Footer.vue'

	const router = useRouter()


	const deliveryAddress = ref(null)
	const business = ref(null)
	const cartList = ref([])
	const totalPrice = ref(0)


	onMounted(() => {

		deliveryAddress.value = getSessionStorage('deliveryAddress')
		business.value = getSessionStorage('business')
		cartList.value = getSessionStorage('cartList') || []
		

		totalPrice.value = cartList.value.reduce((total, item) => {
			return total + (item.foodPrice * item.quantity)
		}, 0)


		if (!cartList.value.length) {
			alert('请先选择商品')
			router.push('/businessInfo')
			return
		}
	})


	const toSelectAddress = () => {
		router.push('/userAddress')
	}


	const toPayment = () => {
		if (!deliveryAddress.value) {
			alert('请选择收货地址')
			return
		}
		

		const orderInfo = {
			deliveryAddress: deliveryAddress.value,
			business: business.value,
			cartList: cartList.value,
			totalPrice: totalPrice.value
		}
		sessionStorage.setItem('orderInfo', JSON.stringify(orderInfo))
		

		router.push('/payment')
	}
</script>

<style scoped>
	/****************** 总容器 ******************/
	.wrapper {
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
	}

	/****************** header部分 ******************/
	.wrapper header {
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

	/****************** 订单信息部分 ******************/
	.wrapper .order-info {
		margin-top: 12vw;
		padding-bottom: 14vw;
	}

	/* 地址部分 */
	.address-section {
		background-color: #fff;
		padding: 3vw;
		margin-bottom: 2vw;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
	}

	.address-info h3 {
		font-size: 4vw;
		color: #333;
		margin-bottom: 2vw;
	}

	.address-info p {
		font-size: 3.5vw;
		color: #666;
	}

	.no-address {
		color: #666;
		font-size: 4vw;
	}

	.fa-angle-right {
		color: #666;
		font-size: 5vw;
	}

	/* 商品信息部分 */
	.food-info {
		background-color: #fff;
		padding: 3vw;
	}

	.business-info h3 {
		font-size: 4vw;
		color: #333;
		padding-bottom: 2vw;
		border-bottom: 1px solid #f5f5f5;
	}

	.food-list li {
		padding: 2vw 0;
		border-bottom: 1px solid #f5f5f5;
	}

	.food-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 3.5vw;
	}

	.food-item .name {
		flex: 1;
		color: #333;
	}

	.food-item .quantity {
		color: #666;
		margin: 0 3vw;
	}

	.food-item .price {
		color: #f00;
		font-weight: bold;
	}

	/****************** 底部支付部分 ******************/
	.payment-info {
		width: 100%;
		height: 14vw;
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 14vw;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 3vw;
		box-sizing: border-box;
		border-top: 1px solid #f5f5f5;
	}

	.total {
		font-size: 4vw;
		color: #333;
	}

	.total span {
		color: #f00;
		font-weight: bold;
	}

	.pay-button button {
		background-color: #38CA73;
		color: #fff;
		border: none;
		padding: 2vw 6vw;
		border-radius: 4px;
		font-size: 4vw;
		cursor: pointer;
	}
</style>