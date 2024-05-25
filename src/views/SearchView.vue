<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchForm from '../components/SearchForm.vue'
import SelectLimit from '../components/SelectLimit.vue'
import SearchResults from '@/components/SearchResults.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import DataLoader from '@/components/DataLoader.vue'
import type { apiResponse, Animal } from '../utils/types'
import { updateQueryParams } from '@/utils/helpFunctions'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const searchValue = ref(localStorage.getItem('searchValue') || '')
const pageNumber = ref(route.query.page ? Number(route.query.page) - 1 : 0)
const pageSize = ref(Number(route.query.limit) || 10)
const totalPages = ref(0)

const searchResultsArray = ref<Readonly<Animal[]>>([])
const errorOccured = ref(false)

async function getData() {
  loading.value = true
  localStorage.setItem('searchValue', searchValue.value)
  const url = `https://stapi.co/api/v1/rest/animal/search?pageNumber=${pageNumber.value}&pageSize=${pageSize.value}`
  try {
    const response = searchValue.value
      ? await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `${encodeURIComponent('name')}=${encodeURIComponent(searchValue.value)}`
        })
      : await fetch(url, {
          method: 'GET'
        })

    const json: apiResponse = await response.json()
    totalPages.value = json.page.totalPages
    loading.value = false
    searchResultsArray.value = json.animals
  } catch {
    errorOccured.value = true
  }
}
getData()

function submitFromChangeLimit(param: string, value: string) {
  if (pageNumber.value) pageNumber.value = 0
  router.push({
    query: updateQueryParams(route.query, param, value)
  })
  getData()
}

function setNewPageNumber(number: number) {
  pageNumber.value = number - 1
  router.push({ query: updateQueryParams(route.query, 'page', number.toString()) })
  getData()
}
</script>

<template>
  <main className="relative min-h-screen flex flex-col grow">
    <section className="bg-lime-200 py-10">
      <SearchForm v-model="searchValue" @submit-form="submitFromChangeLimit" />
    </section>
    <section className="search-results grow">
      <DataLoader v-show="loading" />
      <SelectLimit v-show="!loading" v-model="pageSize" @change-limit="submitFromChangeLimit" />

      <SearchResults v-show="!loading" :searchResultsArray="searchResultsArray" />

      <PaginationComponent
        v-show="!loading"
        v-if="totalPages"
        :pageNumber="pageNumber"
        :totalPages="totalPages"
        @set-new-page-number="setNewPageNumber"
      />
    </section>
  </main>
</template>
