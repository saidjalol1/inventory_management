<script setup>
import { onMounted, ref } from "vue"

const store = ref(false)
const tranzactions = ref(false)
const products = ref(false)
const plusBtn = ref(false)
const productAdd = ref(false)
const storeAdd = ref(false)

const storeData = ref([])
const tranzactionsData = ref([])
const productsData = ref([])

const itemsPerPage = 10; // Number of items per page
const currentPage = ref(1);


const fetchStore = () =>{
    store.value = !store.value
    plusBtn.value = true
    tranzactions.value = false
    products.value = false
    storeData.value = [
        {id: "4532",name:"nimadur",quantity:"34",base_price:"45000",sale_price:"35000",overall_price:"45000"},
        {id: "4532",name:"nimadur",quantity:"34",base_price:"45000",sale_price:"35000",overall_price:"45000"},
        {id: "4532",name:"nimadur",quantity:"34",base_price:"45000",sale_price:"35000",overall_price:"45000"},
        {id: "4532",name:"nimadur",quantity:"34",base_price:"45000",sale_price:"35000",overall_price:"45000"},
        {id: "4532",name:"nimadur",quantity:"34",base_price:"45000",sale_price:"35000",overall_price:"45000"},
    ]
}

const fetchTranzactions = () =>{
    tranzactions.value = !tranzactions.value
    plusBtn.value = false
    store.value = false
    products.value = false
    tranzactionsData.value = [
        {id: "4532",name:"nimadur",quantity:"+34",date:"2024-06-10"},
        {id: "4532",name:"nimadur",quantity:"-34",date:"2024-06-10"},
        {id: "4532",name:"nimadur",quantity:"+34",date:"2024-06-10"},
        {id: "4532",name:"nimadur",quantity:"-34",date:"2024-06-10"},
        {id: "4532",name:"nimadur",quantity:"+34",date:"2024-06-10"},
    ]
}

const fetchproducts = () =>{
    products.value = !products.value
    plusBtn.value = true
    store.value = false
    tranzactions.value = false
    productsData.value = [
        {id: "4532",name:"nimadur",base_price:"45000",sale_price:"35000",},
        {id: "4532",name:"nimadur",base_price:"45000",sale_price:"35000",},
        {id: "4532",name:"nimadur",base_price:"45000",sale_price:"35000",},
        {id: "4532",name:"nimadur",base_price:"45000",sale_price:"35000",},
        {id: "4532",name:"nimadur",base_price:"45000",sale_price:"35000",},
    ]
}

const paginatedStoreProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return storeData.value.slice(start, end);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return productsData.value.slice(start, end);
});

const paginatedTranzactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return tranzactionsData.value.slice(start, end);
});

const totalPages = computed(() => {
    if (store.value) {
        return Math.ceil(storeData.value.length / itemsPerPage);
    } else if (tranzactions.value) {
        return Math.ceil(tranzactionsData.value.length / itemsPerPage);
    } else if (products.value) {
        return Math.ceil(productsData.value.length / itemsPerPage);
    }
    return 0;
});
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
const openModal = () =>{
    if (store.value){
        storeAdd.value = !storeAdd.value
    }else if (products.value){
        productAdd.value = !productAdd.value
    }
}
const closeModal = (modal) => {
    if (modal === 1){
        storeAdd.value = !storeAdd.value
    }else if (modal === 0){
        productAdd.value = !productAdd.value
    }
};
</script>
<template>
<div class="wrapper">
        <div class="header  grid grid-row-1 grid-cols-3 justify-center">
            <div class="flex flex-col items-center justify-center gap-y-2">
                <button @click="fetchStore" :class="{ color: store }" class="text-gray-500 text-center text-xs">Omborda</button>
                <span class="navigate" v-if="store"></span>
            </div>
            <div class="flex flex-col items-center justify-center gap-y-2">
                <button @click="fetchTranzactions" :class="{ color: tranzactions }" class="text-gray-500 text-center text-xs">Tranzaksiya</button>
                <span class="navigate" v-if="tranzactions"></span>
            </div>
            <div class="flex flex-col items-center justify-center gap-y-2">
                <button @click="fetchproducts"  :class="{ color: products }" class="text-gray-500 text-center text-xs">Mahsulotlar</button>
                <span class="navigate" v-if="products"></span>
            </div>
        </div>
    <div class="overflow-x-auto">
    <table v-if="store" class="min-w-full bg-white shadow-md rounded-xl my-6">
      <thead class="rounded">
        <tr class="bg-green-400 text-white text-left rounded">
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold rounded-tl-xl">ID</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Nomi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Miqdori</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Tan narxi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Sotuv Narxi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold rounded-tr-xl">Jami summa</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(product, index) in paginatedStoreProducts" :key="index" class="hover:bg-green-100 border-b border-gray-200">
          <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.id }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.name }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.quantity }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.base_price }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.sale_price }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ product.overall_price }}</td>
        </tr>
      </tbody>
    </table>
    <table v-if="tranzactions" class="min-w-full bg-white shadow-md rounded-xl my-6">
      <thead class="rounded">
        <tr class="bg-green-400 text-white text-left rounded">
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold rounded-tl-xl">ID</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Nomi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Miqdori</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Sana</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(product, index) in paginatedTranzactions" :key="index" class="hover:bg-green-100 border-b border-gray-200">
          <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.id }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.name }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.quantity }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.date }}</td>
        </tr>
      </tbody>
    </table>
    <table v-if="products" class="min-w-full bg-white shadow-md rounded-xl my-6">
      <thead class="rounded">
        <tr class="bg-green-400 text-white text-left rounded">
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold rounded-tl-xl">ID</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Nomi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Tan narxi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Sotuv narxi</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(product, index) in paginatedProducts" :key="index" class="hover:bg-green-100 border-b border-gray-200">
          <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.id }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.name }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.sale_price }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.base_price }}</td>
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
    <div v-if="productAdd" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-0">
          <h3 class="text-lg font-semibold mb-4">Mahsulot Kiritish</h3>
          <div class="mb-4">
            <label for="newName" class="block text-sm font-medium text-gray-700">Nomi</label>
            <input type="text" id="newName" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newAmount" class="block text-sm font-medium text-gray-700">Tan Narxi</label>
            <input  type="number" id="newAmount" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newDate" class="block text-sm font-medium text-gray-700">Sotuv Narxi</label>
            <input  type="Number" id="newDate" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="flex justify-end">
            <button @click="saveNewExpense" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Saqlash</button>
            <button @click="closeModal(0)" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Yopish</button>
          </div>
        </div>
    </div>
    <div v-if="storeAdd" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-0">
          <h3 class="text-lg font-semibold mb-4">Mahsulot Kiritish</h3>
          <div class="mb-4">
            <label for="newName" class="block text-sm font-medium text-gray-700">Nomi</label>
            <input type="text" id="newName" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newAmount" class="block text-sm font-medium text-gray-700">Tan Narxi</label>
            <input  type="number" id="newAmount" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newDate" class="block text-sm font-medium text-gray-700">Sotuv Narxi</label>
            <input  type="Number" id="newDate" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="flex justify-end">
            <button @click="saveNewExpense" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Saqlash</button>
            <button @click="closeModal(1)" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Yopish</button>
          </div>
        </div>
    </div>
    <button v-if="plusBtn" @click="openModal" class="plus text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
    </button>
</div>
</template>
<style scoped>
.header{
    width: 100%;
}
.color{
    color: rgb(12, 240, 12);
}
.navigate{
    width: 100%;
    border: 1px solid rgb(12, 240, 12);
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

.paginate button svg {
  vertical-align: middle;
}
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

</style>