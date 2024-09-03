<script setup>
import { useRouter, useRoute } from 'vue-router';
import { config } from "config"
import { nextTick } from 'vue';

const base = config.baseUrl

const route_index = useRoute()
const router = useRouter();
let isAuthenticated = ref("");
let shops = ref([])
let searchQuery = ref("")

const filteredMarkets = computed(() => {
  if (!searchQuery.value) {
    return shops.value.markets;
  }
  return shops.value.markets.filter(region =>
    region.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


const fetchMarkets = async () => {
    try {
    const response = await fetch(`${base}/markets/region/get/${ route_index.params.id }`, {
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
    const data = await response.json();
    console.log(data)
    shops.value = data
  } catch (error) {
    console.error(error);
    error.value = error
  }
}

onMounted(() => {
    isAuthenticated = localStorage.getItem('authToken');
    
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }

    nextTick(()=>{
        fetchMarkets()
    })
});
const goToDetail = (index) =>{
  router.push(`market/${index}`)
}
</script>
<template>
    <div class="wrapper">
        <MenuFilter v-model="searchQuery" />
        <h1 class="mb-5 mt-5">{{ shops.name }} - Do'konlari</h1>
        <div class="grid grid-row-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div v-for="(shop, index) in filteredMarkets" :key="index" @click="goToDetail(shop.id )" class="card">{{ shop.name }}</div>
        </div>
    </div>
</template>
<style scoped>
.card{
    background-color: white;
    -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    -moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    border-radius: 10px;
    padding: 25px;
}
.card:hover{
    transform: translateY(-10px);
}
</style>