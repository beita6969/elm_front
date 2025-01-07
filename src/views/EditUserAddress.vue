<template>
	<div class="wrapper">

		<header>
			<p>编辑地址</p>
		</header>


		<ul class="form-box">
			<li>
				<div class="title">联系人：</div>
				<div class="content">
					<input type="text" v-model="address.contactName" placeholder="联系人姓名">
				</div>
			</li>
			<li>
				<div class="title">性别：</div>
				<div class="content">
					<input type="radio" v-model="address.contactSex" name="sex" value="1" id="male">
					<label for="male">先生</label>
					<input type="radio" v-model="address.contactSex" name="sex" value="2" id="female">
					<label for="female">女士</label>
				</div>
			</li>
			<li>
				<div class="title">手机号：</div>
				<div class="content">
					<input type="tel" v-model="address.contactTel" placeholder="手机号码">
				</div>
			</li>
			<li>
				<div class="title">收货地址：</div>
				<div class="content">
					<input type="text" v-model="address.address" placeholder="收货地址">
				</div>
			</li>
		</ul>


		<div class="save-btn">
			<button @click="saveAddress">保存</button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSessionStorage, setSessionStorage } from '@/common'
import { addressApi } from '@/api'

const router = useRouter()


const address = ref({
	contactName: '',
	contactSex: '1',
	contactTel: '',
	address: '',
	userId: ''
})

onMounted(() => {

	const editAddress = getSessionStorage('editAddress')
	const user = getSessionStorage('user')
	
	if (editAddress) {

		address.value = { ...editAddress }
	} else if (user) {

		address.value.userId = user.userId
	} else {

		router.push('/login')
		return
	}
})


const saveAddress = async () => {

	if (!address.value.contactName) {
		alert('请输入联系人姓名')
		return
	}
	if (!address.value.contactTel) {
		alert('请输入手机号码')
		return
	}
	if (!address.value.address) {
		alert('请输入收货地址')
		return
	}

	try {
		if (address.value.daId) {

			await addressApi.updateAddress(address.value)
		} else {

			await addressApi.saveAddress(address.value)
		}
		router.push('/userAddress')
	} catch (error) {
		console.error('保存地址失败:', error)
		alert('保存地址失败，请重试')
	}
}
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

/****************** 表单部分 ******************/
.wrapper .form-box {
	width: 100%;
	margin-top: 12vw;
}

.wrapper .form-box li {
	box-sizing: border-box;
	padding: 4vw 3vw;
	display: flex;
	align-items: center;
	border-bottom: solid 1px #DDD;
}

.wrapper .form-box li .title {
	flex: 0 0 18vw;
	font-size: 3.5vw;
	color: #666;
}

.wrapper .form-box li .content {
	flex: 1;
}

.wrapper .form-box li .content input[type=text],
.wrapper .form-box li .content input[type=tel] {
	border: none;
	outline: none;
	width: 100%;
	height: 4vw;
	font-size: 3.5vw;
}

.wrapper .form-box li .content input[type=radio] {
	margin-right: 2vw;
}

.wrapper .form-box li .content label {
	margin-right: 4vw;
	font-size: 3.5vw;
	color: #666;
}

/****************** 保存按钮 ******************/
.wrapper .save-btn {
	width: 100%;
	box-sizing: border-box;
	padding: 4vw 3vw;
}

.wrapper .save-btn button {
	width: 100%;
	height: 10vw;
	font-size: 3.8vw;
	font-weight: 700;
	color: #fff;
	background-color: #38CA73;
	border-radius: 4px;
	border: none;
	outline: none;
}
</style>