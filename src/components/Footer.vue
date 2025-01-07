<template>
	<div id="footer">

		<ul class="footer">
			<li @click="toPage('/index')">
				<i class="fa fa-home"></i>
				<p>首页</p>
			</li>
			<li class="disabled">
				<i class="fa fa-compass"></i>
				<p>发现</p>
			</li>
			<li @click="toPage('/orderList')">
				<i class="fa fa-list"></i>
				<p>订单</p>
			</li>
			<li class="disabled">
				<i class="fa fa-user"></i>
				<p>我的</p>
			</li>
		</ul>
	</div>
</template>

<script setup>

	import {useRouter} from 'vue-router';
	const router = useRouter();
	
	const toPage = (path) => {
		router.push(path);
	};
</script>

<style scoped>
	/****************** 底部菜单部分 ******************/
	.wrapper .footer {
		width: 100%;
		height: 14vw;
		border-top: solid 1px #DDD;
		background-color: #fff;

		position: fixed;
		left: 0;
		bottom: 0;

		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.wrapper .footer li {
		/*li本身的尺寸完全由内容撑起*/
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		color: #999;
		user-select: none;
		cursor: pointer;
	}

	/* 添加禁用状态的样式 */
	.wrapper .footer li.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.wrapper .footer li p {
		font-size: 2.8vw;
	}

	.wrapper .footer li i {
		font-size: 5vw;
	}
</style>