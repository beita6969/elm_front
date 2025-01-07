import {
	createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'


import 'font-awesome/css/font-awesome.min.css'


const app = createApp(App)
app.config.globalProperties.$axios = axios
app.use(store).use(router).mount('#app')


router.beforeEach((to, from, next) => {
	
	const user = sessionStorage.getItem('user');
	
	
	const publicPaths = ['/', '/index', '/businessList', '/businessInfo', '/login', '/register'];
	
	
	if (!publicPaths.includes(to.path) && !user) {
		next('/login');
	} else {
		next();
	}
})