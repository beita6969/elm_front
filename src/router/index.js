import {
	createRouter,
	createWebHashHistory
} from 'vue-router'


const Index = () => import('../views/Index.vue')
const BusinessList = () => import('../views/BusinessList.vue')
const BusinessInfo = () => import('../views/BusinessInfo.vue')
const Login = () => import('../views/Login.vue')
const Order = () => import('../views/Order.vue')
const UserAddress = () => import('../views/UserAddress.vue')
const AddUserAddress = () => import('../views/AddUserAddress.vue')
const Payment = () => import('../views/Payment.vue')
const OrderList = () => import('../views/OrderList.vue')
const EditUserAddress = () => import('../views/EditUserAddress.vue')
const Register = () => import('../views/Register.vue')

const routes = [{
		path: '/',
		name: 'Home',
		component: Index
	}, {
		path: '/index',
		name: 'Index',
		component: Index
	}, {
		path: '/businessList',
		name: 'BusinessList',
		component: BusinessList
	},
	{
		path: '/businessInfo',
		name: 'BusinessInfo',
		component: BusinessInfo
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/order',
		name: 'Order',
		component: Order
	},
	{
		path: '/userAddress',
		name: 'UserAddress',
		component: UserAddress
	},
	{
		path: '/addUserAddress',
		name: 'AddUserAddress',
		component: AddUserAddress
	},
	{
		path: '/payment',
		name: 'Payment',
		component: Payment
	},
	{
		path: '/orderList',
		name: 'OrderList',
		component: OrderList
	},
	{
		path: '/editUserAddress',
		name: 'EditUserAddress',
		component: EditUserAddress
	},
	{
		path: '/register',
		name: 'Register',
		component: Register
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})


router.beforeEach((to, from, next) => {
	const publicPages = ['/', '/index', '/login', '/register', '/businessList', '/businessInfo']
	const authRequired = !publicPages.includes(to.path)
	const user = JSON.parse(sessionStorage.getItem('user'))

	if (authRequired && !user) {
		return next('/login')
	}
	next()
})

export default router