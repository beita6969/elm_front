<template>
	<div class="wrapper">

		<header>
			<p>我的订单</p>
		</header>


		<div style="margin-top: 15vw; padding: 4vw; font-size: 3vw; color: #666;">
			<p>未支付订单数量: {{orderUnpaidArr.length}}</p>
			<p>已支付订单数量: {{orderPaidArr.length}}</p>
		</div>


		<h3>未支付订单信息：</h3>
		<ul class="order">
			<li v-for="item in orderUnpaidArr" :key="item.orderId">
				<div class="order-info">
					<p @click="detailetShow(item)">
						{{item.business.businessName}}（云南大学店）
						<i class="fa fa-caret-down"></i>
					</p>
					<div class="order-info-right">
						<p>&#165;{{item.orderTotal}}</p>
						<div class="order-info-right-icon" @click="toPayment(item.orderId)">去支付</div>
					</div>
				</div>
				<ul class="order-detailet" v-show="item.isShowDetailet">
					<li v-for="odItem in  item.list" :key="odItem.foodId">
						<p>{{odItem.food.foodName}} x {{odItem.quantity}}</p>
						<p>&#165;{{odItem.food.foodPrice*odItem.quantity}}</p>
					</li>
					<li>
						<p>配送费</p>
						<p>&#165;{{item.business.deliveryPrice}}</p>
					</li>
				</ul>
			</li>
		</ul>

		<h3>已支付订单信息：</h3>
		<ul class="order">
			<li v-for="item in orderPaidArr" :key="item.orderId">
				<div class="order-info">
					<p>
						{{item.business.businessName}}（云南大学店）
						<i class="fa fa-caret-down" @click="detailetShow(item)"></i>
					</p>
					<div class="order-info-right">
						<p>&#165;{{item.orderTotal}}</p>
					</div>
				</div>
				<ul class="order-detailet" v-show="item.isShowDetailet">
					<li v-for="odItem in  item.list" :key="odItem.foodId">
						<p>{{odItem.food.foodName}} x {{odItem.quantity}}</p>
						<p>&#165;{{odItem.food.foodPrice*odItem.quantity}}</p>
					</li>
				</ul>
			</li>
		</ul>

		<Footer></Footer>
	</div>
</template>

<script setup>
	import Footer from '../components/Footer.vue';
	import qs from 'qs';
	import {
		useRouter,
		useRoute
	} from 'vue-router';
	import {
		ref,
		inject,
		onMounted,
		watch
	} from 'vue';
	import {
		getSessionStorage
	} from '../common.js';

	const axios = inject("axios");
	const router = useRouter();
	const route = useRoute();


	const orderPaidArr = ref([]);

	const orderUnpaidArr = ref([]);

	const getOrderList = async () => {
		try {
			const user = getSessionStorage('user')
			if (!user) {
				router.push('/login')
				return
			}

			console.log('正在获取订单列表...');
			const response = await axios.post('OrderController/listOrdersByUserId', 
				qs.stringify({ userId: user.userId }))
			
			console.log('服务器返回的完整数据:', response);
			console.log('订单数据:', response.data);

			if (response.data && Array.isArray(response.data)) {

				orderPaidArr.value = [];
				orderUnpaidArr.value = [];
				

				response.data.forEach((order, index) => {
					console.log(`处理第 ${index + 1} 个订单:`, order);
					console.log('订单状态:', order.orderState);
					

					const newOrder = { ...order, isShowDetailet: false };
					

					if (newOrder.orderState === 1 || newOrder.orderState === "1") {
						console.log('添加到已支付订单列表');
						orderPaidArr.value = [...orderPaidArr.value, newOrder];
					} else {
						console.log('添加到未支付订单列表');
						orderUnpaidArr.value = [...orderUnpaidArr.value, newOrder];
					}
				});
				
				console.log('最终的未支付订单列表:', orderUnpaidArr.value);
				console.log('最终的已支付订单列表:', orderPaidArr.value);
			} else {
				console.error('服务器返回的数据格式不正确:', response.data);
			}
		} catch (error) {
			console.error('获取订单列表失败:', error)
		}
	}


	const toPayment = (orderId) => {
		router.push({
			path: "/payment",
			query: {
				orderId: orderId
			}
		});
	}

	const detailetShow = (orders) => {
		orders.isShowDetailet = !orders.isShowDetailet;
	}


	watch(() => route.query, (newQuery) => {
		console.log('路由查询参数变化:', newQuery);
		if (newQuery.refresh === 'true') {
			console.log('检测到刷新请求，重新获取订单列表');
			getOrderList();
		}
	}, { immediate: true });


	onMounted(() => {
		getOrderList();
	});


	defineExpose({
		refreshOrders: getOrderList
	});
</script>

<style scoped>
	/****************** 总容器 ******************/
	.wrapper {
		width: 100%;
		height: 100%;
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

	/****************** 历史订单列表部分 ******************/
	.wrapper h3 {
		margin-top: 12vw;
		box-sizing: border-box;
		padding: 4vw;
		font-size: 4vw;
		font-weight: 300;
		color: #999;
	}

	.wrapper .order {
		width: 100%;
	}

	.wrapper .order li {
		width: 100%;
	}

	.wrapper .order li .order-info {
		box-sizing: border-box;
		padding: 2vw 4vw;
		font-size: 4vw;
		color: #666;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.wrapper .order li .order-info .order-info-right {
		display: flex;
	}

	.wrapper .order li .order-info .order-info-right .order-info-right-icon {
		background-color: #f90;
		color: #fff;
		border-radius: 3px;
		margin-left: 2vw;
		user-select: none;
		cursor: pointer;
	}

	.wrapper .order li .order-detailet {
		width: 100%;
	}

	.wrapper .order li .order-detailet li {
		width: 100%;
		box-sizing: border-box;
		padding: 1vw 4vw;
		color: #666;
		font-size: 3vw;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>