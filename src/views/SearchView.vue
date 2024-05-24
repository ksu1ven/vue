<script setup lang="ts">
import { ref, computed } from 'vue'
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
const paginationButtonsValue = ref(
  pageNumber.value > 2
    ? [1, 2, 3].map((el, ind) => pageNumber.value + ind - 1 + el - el)
    : [1, 2, 3]
)

const paginationButtonsValueComputed = computed(() => {
  return paginationButtonsValue.value.filter((value) => totalPages.value > value)
})

const searchResultsArray = ref<Readonly<Animal[]>>([])
const errorOccured = ref(false)

async function getData() {
  console.log('getData')
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

function searchAnimals(param: string, value: string) {
  paginationButtonsValue.value = [1, 2, 3]
  if (pageNumber.value) pageNumber.value = 0
  router.push({
    query: updateQueryParams(route.query, param, value)
  })
  getData()
}

function changePaginationButtonsValue() {
  if (
    totalPages.value - paginationButtonsValue.value[paginationButtonsValue.value.length - 1] <=
    1
  ) {
    return
  }
  const increaseNumber =
    totalPages.value - paginationButtonsValue.value[paginationButtonsValue.value.length - 1] <
    paginationButtonsValue.value.length
      ? 1
      : paginationButtonsValue.value.length
  console.log(increaseNumber)

  paginationButtonsValue.value = paginationButtonsValue.value.map((el) => el + increaseNumber)

  const newPageNumber = paginationButtonsValue.value.at(-1) || 3 + increaseNumber
  router.push({ query: updateQueryParams(route.query, 'page', newPageNumber.toString()) })
  pageNumber.value = newPageNumber - 1
  getData()
}

function clickNextPrevButton(direction: 'next' | 'prev') {
  const increaseDecreaseNumber = direction == 'next' ? 1 : -1
  const newPageNumber = pageNumber.value + increaseDecreaseNumber + 1
  pageNumber.value = newPageNumber - 1
  router.push({ query: updateQueryParams(route.query, 'page', newPageNumber.toString()) })

  if (!paginationButtonsValue.value.includes(newPageNumber)) {
    const changedArr = paginationButtonsValue.value.map((el) => el + increaseDecreaseNumber)
    paginationButtonsValue.value = changedArr
  }
  getData()
}

function clickLastPage() {
  if (totalPages.value > paginationButtonsValue.value.length)
    paginationButtonsValue.value = paginationButtonsValue.value.map(
      (el, ind) => totalPages.value - paginationButtonsValue.value.length + ind + el - el
    )
  pageNumber.value = totalPages.value - 1
  router.push({ query: updateQueryParams(route.query, 'page', totalPages.value.toString()) })
  getData()
}

function setPageNumber(value: number) {
  pageNumber.value = value - 1
  router.push({ query: updateQueryParams(route.query, 'page', value.toString()) })
  getData()
}
</script>

<template>
  <main className="relative min-h-screen flex flex-col grow">
    <section className="bg-lime-200 py-10">
      <SearchForm v-model="searchValue" @submit-form="searchAnimals" />
    </section>
    <section className="search-results grow">
      <DataLoader v-show="loading" />
      <SelectLimit v-show="!loading" v-model="pageSize" @change-limit="searchAnimals" />

      <SearchResults v-show="!loading" :searchResultsArray="searchResultsArray" />

      <PaginationComponent
        v-show="!loading"
        v-if="totalPages"
        :pageNumber="pageNumber"
        :totalPages="totalPages"
        :paginationButtonsValue="paginationButtonsValueComputed"
        @click-last-page="clickLastPage"
        @click-next-prev-button="clickNextPrevButton"
        @change-pagination-buttons-value="changePaginationButtonsValue"
        @set-page-number="setPageNumber"
      />
    </section>
  </main>
</template>
