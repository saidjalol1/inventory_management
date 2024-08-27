<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const saleId = route.params.id

// Mock data
const data = ref({
  sale: {
    id: 2,
    date: "2024-06-10"
  },
  items: [
    {
      name: "Item 1",
      quantity: 1,
      amount: 10000,
      overall_price: 10000
    },
    {
      name: "Item 2",
      quantity: 2,
      amount: 5000,
      overall_price: 10000
    }
  ]
})

const sale = data.value.sale
const items = data.value.items

// Function to print the page
function printPage() {
  window.print()
}
</script>

<template>
  <div class="overflow-x-auto">
    <div v-if="sale">
      <h2>Sotuv ID: {{ sale.id }}</h2>
      <p>Sana: {{ sale.date }}</p>

      <h3>Mahsulotlar :</h3>
      <table class="min-w-full bg-white shadow-md rounded-xl my-6">
        <thead class="rounded">
          <tr class="bg-green-400 text-white text-left rounded-xl">
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tl-xl">Nomi</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Miqdori</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Summasi</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 rounded">
          <tr v-for="item in items" :key="item.name" class="hover:bg-green-100 border-b border-gray-200">
            <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ item.name }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ item.amount }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ item.overall_price }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
  <NuxtLink to="/app/{{ saleId }}">
    <button  class="plus text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
      <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
      <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
    </svg>
  </button>
  </NuxtLink>
</template>

<style scoped>
.plus {
  width: 35px;
  height: 35px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 20px;
  bottom: 80px;
  border-radius: 7px;
  background-color: white;
  -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
  -moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
  box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
}
</style>
