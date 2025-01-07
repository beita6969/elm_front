<template>
	<div class="wrapper">
		<header>
			<p>我的地址</p>
		</header>


		<ul class="address-list">
			<li v-for="item in addressList" :key="item.daId" @click="selectAddress(item)">
				<div class="address-info">
					<h3>{{ item.contactName }} {{ item.contactTel }}</h3>
					<p>{{ item.address }}</p>
				</div>
				<div class="address-actions">
					<i class="fa fa-edit" @click.stop="editAddress(item)"></i>
					<i class="fa fa-trash" @click.stop="removeAddress(item)"></i>
				</div>
			</li>
		</ul>


		<div class="add-btn">
			<button @click="toAddAddress">新增地址</button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getSessionStorage, setSessionStorage } from '@/common'
import { addressApi } from '@/api'

const router = useRouter()
const route = useRoute()
const addressList = ref([])


const getAddressList = async () => {
	const user = getSessionStorage('user')
	if (!user) {
		router.push('/login')
		return
	}

	try {
		const response = await addressApi.getAddressList({ userId: user.userId })
		addressList.value = response.data
	} catch (error) {
		console.error('获取地址列表失败:', error)
	}
}


const selectAddress = (address) => {
	setSessionStorage('deliveryAddress', address)
	router.back()
}


const editAddress = (address) => {
	setSessionStorage('editAddress', address)
	router.push('/editUserAddress')
}


const removeAddress = async (address) => {
	if (!confirm('确定要删除该地址吗？')) return

	try {
		await addressApi.removeAddress({ daId: address.daId })
		getAddressList()
	} catch (error) {
		console.error('删除地址失败:', error)
		alert('删除地址失败，请重试')
	}
}


const toAddAddress = () => {
	router.push('/addUserAddress')
}

onMounted(() => {
	getAddressList()
})
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

.address-list {
	margin-top: 12vw;
	padding-bottom: 14vw;
}

.address-list li {
	background-color: #fff;
	margin-bottom: 2vw;
	padding: 3vw;
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

.address-actions {
	display: flex;
	gap: 4vw;
}

.address-actions i {
	font-size: 5vw;
	color: #666;
}

.add-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 3vw;
	box-sizing: border-box;
	background-color: #fff;
}

.add-btn button {
	width: 100%;
	height: 10vw;
	background-color: #0097FF;
	color: #fff;
	border: none;
	border-radius: 4px;
	font-size: 4vw;
}
</style>