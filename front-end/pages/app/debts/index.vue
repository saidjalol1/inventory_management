<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { config } from "config"
import { data } from 'autoprefixer';

const router = useRouter();
let isAuthenticated = ref("");
let searchQuery = ref("");
let dateQuery = ref(""); 
const base = config.baseUrl

const sales = ref([]);
let error = ref("");
const itemsPerPage = 10; // Number of items per page
const currentPage = ref(1);

// Modal control and data
const showModal = ref(false);
const selectedSale = ref(null);
const newQuantity = ref(0);

const handleDateFilterChange = (newDateFilter) => {
    dateQuery.value = newDateFilter;
};

const fetchSales = async () =>{
    try {
      const response = await fetch(`${base}/debts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        console.log("Error status:", response.status);
        error.value =  await response.text()
        return; // Exit function if response is not OK
      }

      const objs = await response.json();
      sales.value = objs
      console.log(objs)
    } catch (error) {
      console.error(error);
      error.value = error
    }
}

const savePayment = async () => {
  if (selectedSale.value) {
    selectedSale.value.payment = newQuantity.value;

    try {
      const response = await fetch(`${base}/sales/${selectedSale.value.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment: newQuantity.value,
        }),
      });

      if (!response.ok) {
        console.log("Error status:", response.status);
        error.value = await response.text();
        return;
      }

      const updatedSale = await response.json();
      fetchSales()
      console.log(updatedSale);
    } catch (error) {
      console.error(error);
      error.value = error;
    }
  }
  closeModal();
};

const filteredsales = computed(() => {
  let filtered = sales.value;

  if (searchQuery.value) {
    dateQuery.value = ""
    console.log(searchQuery.value)
    filtered = filtered.filter(code =>
      code.shop.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (dateQuery.value) {
    searchQuery.value = ""
    console.log(dateQuery.value)
    filtered = filtered.filter(sale => {
      return sale.date_added.includes(dateQuery.value);
    });
  }

  return filtered;
});


const paginatedSales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredsales.value.slice(start, end);
});
const totalPages = computed(() => Math.ceil(sales.value.length / itemsPerPage));

const isModalOpen = ref(false);
const openModal = () => {
    isModalOpen.value = true;
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};
const editSale = (sale) => {
  selectedSale.value = sale;
  newQuantity.value = sale.quantity;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedSale.value = null;
};
const goToDetail = (index) =>{
    router.push(`/app/sale/${index}`)
}

function formatPrice(price) {
  return new Intl.NumberFormat().format(price)
}
onMounted(() => {
    isAuthenticated = localStorage.getItem('authToken');
    
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }
    nextTick(() =>{
        fetchSales()
    })
});
const f = ref(true)
</script>
<template>
    <div class="wrapper">
    <MenuFilter v-model="searchQuery" :dateFilter="dateQuery" @update:dateFilter="handleDateFilterChange" :f="f"/>
    <div class="overflow-x-auto">
    <table class="min-w-full bg-white shadow-md rounded-xl my-6">
      <thead class="rounded">
        <tr class="bg-green-400 text-white text-left rounded">
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tl-xl">Ismi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">To'lov</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Qarz</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Jami</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Sanasi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tr-xl">Actions</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(sale, index) in paginatedSales" :key="index" class="hover:bg-green-100 border-b border-gray-200">
          <td @click="goToDetail(sale.id)" class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-xs cursor-pointer">{{ sale.shop.name }}</td>
          <td @click="goToDetail(sale.id)" class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs cursor-pointer">{{ formatPrice(sale.payment) }}</td>
          <td @click="goToDetail(sale.id)" class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs cursor-pointer">{{ formatPrice(sale.debt )}}</td>
          <td @click="goToDetail(sale.id)" class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs cursor-pointer">{{ formatPrice( sale.amount ) }}</td>
          <td @click="goToDetail(sale.id)" class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs cursor-pointer">{{ sale.date_added }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">
            <div class="flex flex-col sm:flex-row">
              <button @click="editSale(sale)" class="text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="paginate flex justify-between items-center mt-4">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
      </svg>
    </button>
    <span class="text-gray-700 text-sm">
      {{ currentPage }} / {{ totalPages }}
    </span>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
      </svg>
    </button>
  </div>

  <!-- Modal for editing sale -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded shadow-lg w-80">
      <h2 class="text-lg font-semibold mb-4">To'lov +</h2>
      <div class="mb-4">
        <label for="quantity" class="block text-sm font-medium text-gray-700">To'lov</label>
        <input
          v-model.number="newQuantity"
          id="quantity"
          type="number"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div class="flex justify-end">
        <button @click="savePayment" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Saqlash</button>
        <button @click="closeModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>
.plus{
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
.paginate{
  margin-bottom: 200px;
  padding: 0 20%;
}
.paginate button:disabled {
  cursor: not-allowed;
}

.paginate span {
  font-weight: bold;

}

button svg {
  vertical-align: middle;
}
</style>
