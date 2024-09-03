<script setup>
import { nextTick, ref } from 'vue';
import { config } from 'config';
import { useRouter } from 'vue-router';

const isOpen = ref(false)
const router = useRouter();
const obj = ref({})
const money = ref([])
let isAuthenticated = ref("");
const base = config.baseUrl;
const amount = ref('');
const date = ref('');
const itemsPerPage = 10;
const currentPage = ref(1);


const paginatedmoney = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return money.value.slice(start, end);
});
const totalPages = computed(() => Math.ceil(money.value.length / itemsPerPage));

const fetchData = async () => {
  try {
    const response = await fetch(`${base}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },      
    });
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const objs = await response.json()
    obj.value = objs
    money.value = objs["moneys"]
    console.log(objs["moneys"])
    console.log(objs)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const submitTransaction = async () => {
  try {
    const response = await fetch(`${base}/expance/money_transactions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount : amount.value,
        date : date.value
    }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result)
    amount.value  = ""
    date.value  = ""
    console.log('Transaction added:', result);
  } catch (error) {
    console.error('Error submitting transaction:', error);
  }
};

function formatPrice(price) {
  return new Intl.NumberFormat().format(price)
}

onMounted(() => {
    isAuthenticated = localStorage.getItem('authToken');
    
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }
    nextTick(() =>{
        fetchData()
    })
});
const toggleModal = () =>{
    isOpen.value = true
}
const closeModal = () =>{
    isOpen.value = false
}
</script>
<template>
    <div class="wrapper">
        <div class="grid grid-cols-1 grid-row-1 gap-2 mt-3">
            <div class="card1">
                <div class="icon flex justify-between">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-wallet" viewBox="0 0 16 16">
                            <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"/>
                        </svg>
                    </span>
                    <span class="cl" @click="toggleModal">
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                                <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                            </svg>
                        </button>
                    </span>
                </div>
                <div class="text">
                    {{ formatPrice(obj.sales)}} so'm
                    <span>Balance</span>
                </div>
            </div>
        </div>
        <div class="grid grid-row-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-6">
            <div class="card1">
                <div class="icon">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
                            <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27m.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0z"/>
                            <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5m8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
                        </svg>
                    </span>
                </div>
                <div class="text">
                    {{ formatPrice(obj.sales)}} so'm
                    <span>Sotuv</span>
                </div>
            </div>
            <div class="card1">
                <div class="icon">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
                            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                        </svg>
                    </span>
                </div>
                <div class="text">
                    {{ formatPrice(obj.income)}} so'm
                    <span>Foyda</span>
                </div>
            </div>
            <div class="card1">
                <div class="icon grid grid-rows-1 grid-cols-4">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-box-seam" viewBox="0 0 16 16">
                            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
                        </svg>
                    </span>
                </div>
                <div class="text">
                    {{ obj.most_product }}
                    <span>Eng ko'p sotilgan mahsulot</span>
                </div>
            </div>
            <div class="card1">
                <div class="icon grid grid-rows-1 grid-cols-4">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                        </svg>
                    </span>
                </div>
                <div class="text">
                    {{ obj.most_shop }}
                    <span>Eng ko'p harid qilgan mijoz</span>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 grid-row-1 gap-2">
            <div class="chart">
                <ClientOnly>
                    <ChartBar />
                </ClientOnly>
            </div>
        </div>
        <div class="grid grid-cols-1 grid-row-1 gap-2 mt-2 mb-20">
            <div class="card1">
                Balance Tarixi
                <div class="w-full flex justify-between items-center" v-for="(i, index) in paginatedmoney" :key="index" >
                    <span class="text-red-600 text-sm mt-2">- {{ i.amount }} so'm</span>
                    <span class="text-green-500 text-xs mt-2">{{ i.date }}</span>
                </div>
            </div>
        </div>
        <div class="paginate flex justify-between items-center mt-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
          >
            <!-- Previous page icon -->
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
            <!-- Next page icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
          </button>
        </div>
        <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center  overflow-y-auto px-4">
            <div class="fixed inset-0 bg-black opacity-50 overflow-y-auto" @click="closeModal"></div>
            <div class="modal relative bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <h2 class="text-lg font-semibold mb-4">Sotuv Qo'shish +</h2>
        <form @submit.prevent="submitTransaction">
            <div class="mb-4">
                <label for="payment" class="block text-sm font-medium text-gray-700">Miqdori</label>
                <input type="number" id="payment" v-model="amount" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
            </div>
            <div class="mb-4">
                <label for="payment" class="block text-sm font-medium text-gray-700">Sanasi</label>
                <input type="date" id="payment" v-model="date" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
            </div>
            <div class="flex justify-end mt-4">
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Saqlash</button>
            </div>
        </form>
            </div>
        </div>
    </div>
    
</template>
<style scoped>
.card1{
    background-color: white;
    border-radius: 10px;
    padding: 25px;
    -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    -moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
}
.icon span{
    width: 50px;
    height: 50px;
    background-color: rgba(84, 241, 149, 0.26);
    border-radius: 10px;
    padding: 10px;
    color: green;
    display: flex;
    justify-content: center;
    align-items: center;
}
.icon span:nth-child(2){
    width: 50px;
    height: 50px;
    background-color: rgb(238, 238, 238);
    color: grey;
    border-radius: 10px;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    -moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    cursor: pointer;
}
.text{
    margin-top: 20px;
    font-size: 14px;
    color: black;
    font-weight: 600;
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}
.text span{
    font-size: 13px;
    color: gray;
    font-weight: 600;
}
.chart{
    margin-top: 10px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
-moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
}
.modal{
    width: 400px;
    height: auto;
    overflow-y: auto;
    margin-top: 110px;
  }
</style>