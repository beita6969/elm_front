<template>
  <div class="wrapper">
    <header>
      <p>个人中心</p>
    </header>

    <div class="content">
      <div class="user-info">
        <img :src="userInfo.userImg || '/default-avatar.png'" alt="头像">
        <p>{{ userInfo.userName || '未登录' }}</p>
      </div>

      <div class="menu-list">
        <div class="menu-item" @click="toAddress">
          <i class="fa fa-map-marker"></i>
          <span>收货地址</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="menu-item" @click="toOrderList">
          <i class="fa fa-list"></i>
          <span>我的订单</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSessionStorage } from '@/common'
import Footer from '@/components/Footer.vue'

const router = useRouter()
const userInfo = ref({})

onMounted(() => {
  userInfo.value = getSessionStorage('user') || {}
})

const toAddress = () => {
  router.push('/userAddress')
}

const toOrderList = () => {
  router.push('/orderList')
}
</script>

<style scoped>
/* 添加样式... */
</style> 