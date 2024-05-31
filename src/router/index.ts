import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '@/views/SearchView.vue'
import ErrorView from '@/views/ErrorView.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			path: '/',
			name: 'search',
			component: SearchView,
			children: [
				{
					path: '',
					name: 'details',
					component: () => import('../components/DetailsComponent.vue')
				}
			]
		},
		{
			path: '/*',
			name: 'error',
			component: ErrorView
		}
	]
})

export default router
