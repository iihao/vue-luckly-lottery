import { createRouter, createWebHashHistory } from 'vue-router'
import index from '../views/indexView'
const routes = [
	{
		path: '/',
		name: '首页',
		component: index,
	},
	{
		path: '/setting',
		name: '设置',
		component: ()=> import ('../views/settingView'),
	}
    
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})
export default router