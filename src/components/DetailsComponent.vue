<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataLoader from '@/components/DataLoader.vue'
import { updateQueryParams } from '@/utils/helpFunctions'
import type { Animal, apiResponse } from '@/utils/types'

const router = useRouter()
const route = useRoute()

const loading = ref(false)

const animal = ref<Animal | null>(null)

watchEffect(async () => {
	try {
		loading.value = true
		const animalName = Array.isArray(route.query.details)
			? route.query.details[0]
			: route.query.details
		if (animalName) {
			const response = await fetch(
				'https://stapi.co/api/v1/rest/animal/search?pageNumber=0&pageSize=100',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: `${encodeURIComponent('name')}=${encodeURIComponent(animalName)}`
				}
			)
			const json: apiResponse = await response.json()
			animal.value = json.animals[0]
		}
		loading.value = false
	} catch {
		throw new Error('No such uid')
	}
})
</script>

<template>
	<aside
		v-if="route.query.details"
		className="relative w-1/3 bg-lime-700 text-white flex flex-col pt-40 items-center gap-6 px-10"
	>
		<button
			className="absolute top-14 right-14 flex items-center justify-center w-16 h-16 bg-lime-300 text-4xl p-3 rounded-full"
			@click="router.push({ query: updateQueryParams(route.query, 'details', '') })"
		>
			X
		</button>

		<DataLoader v-show="loading" />

		<div v-show="!loading" v-if="animal">
			<h1 className="text-5xl font-extrabold text-lime-300 mb-10">{{ animal?.name }}</h1>
			<ul className="text-3xl font-extrabold">
				<li>Avian: {{ animal?.avian ? 'Yes' : 'No' }}</li>
				<li>Canine: {{ animal?.canine ? 'Yes' : 'No' }}</li>
				<li>EarthAnimal: {{ animal?.earthAnimal ? 'Yes' : 'No' }}</li>
				<li>EarthInsect: {{ animal?.earthInsect ? 'Yes' : 'No' }}</li>
				<li>Feline: {{ animal?.feline ? 'Yes' : 'No' }}</li>
			</ul>
		</div>
		<h2 className="text-3xl" v-else>
			{{
				`We can't find ${route.query.details}. Problems with server or ${route.query.details} doesn't exist. Try again`
			}}
		</h2>
	</aside>
</template>
