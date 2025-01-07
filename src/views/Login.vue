<template>
	<div class="wrapper">


		<header>
			<p>用户登陆</p>
		</header>


		<ul class="form-box">
			<li>
				<div class="title">
					手机号码：
				</div>
				<div class="content">
					<input v-model="userId" type="text" placeholder="手机号码">
				</div>
			</li>
			<li>
				<div class="title">
					密码：
				</div>
				<div class="content">
					<input v-model="password" type="password" placeholder="密码">
				</div>
			</li>
		</ul>

		<div class="button-login">
			<button @click="login">登陆</button>
		</div>
		<div class="button-register">
			<button @click="toRegister()">去注册</button>
		</div>


		<Footer></Footer>
	</div>
</template>

<script setup>

	import Footer from '@/components/Footer.vue';

	import {
		useRouter,
		useRoute
	} from 'vue-router';

	import {
		ref,
		inject
	} from 'vue';
	import {
		setSessionStorage
	} from '@/common';

	const router = useRouter();
	const userId = ref("");
	const password = ref("");


	import { userApi } from '@/api';

	const login = async () => {
		if (!userId.value) {
			alert("手机号不能为空!!!!")
			return;
		}
		if (!password.value) {
			alert("密码不能为空!!!!")
			return;
		}
		
		try {

			const response = await userApi.login({
				userId: userId.value,
				password: password.value
			});
			
			let user = response.data;
			if (!user) {
				alert("用户名或密码不正确");
			} else {
				user.userImg = "";
				setSessionStorage("user", user);
				router.go(-1);
			}
		} catch (error) {
			console.error('登录失败:', error);
			alert("登录失败，请稍后重试");
		}
	}

	const toRegister = () => {
		router.push({
			path: "/register"
		})
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
		padding: 4vw 3vw 0 3vw;
		display: flex;
		align-items: center;
	}

	.wrapper .form-box li .title {
		flex: 0 0 18vw;
		font-size: 3vw;
		font-weight: 700;
		color: #666;
	}

	.wrapper .form-box li .content {
		flex: 1;
	}

	.wrapper .form-box li .content input {
		border: none;
		outline: none;
		width: 100%;
		height: 4vw;
		font-size: 3vw;
	}

	.wrapper .button-login {
		width: 100%;
		box-sizing: border-box;
		padding: 4vw 3vw 0 3vw;
	}

	.wrapper .button-login button {
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

	.wrapper .button-register {
		width: 100%;
		box-sizing: border-box;
		padding: 4vw 3vw 0 3vw;
	}

	.wrapper .button-register button {
		width: 100%;
		height: 10vw;
		font-size: 3.8vw;
		font-weight: 700;

		color: #666;
		background-color: #EEE;
		border: solid 1px #DDD;
		border-radius: 4px;

		border: none;
		outline: none;
	}
</style>