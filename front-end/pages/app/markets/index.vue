<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { config } from "config"

const base = config.baseUrl

let isAuthenticated = ref("");
const data = ref([])
const router = useRouter();


const fetchProvinces = async () => {
    try {
    const response = await fetch(`${base}/markets/province/get`, {
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
    data.value = objs
  } catch (error) {
    console.error(error);
    error.value = error
  }
};

const goToDetail = (index) => {
  router.push(`/app/markets/${index}`);
};
onMounted(() => {
    isAuthenticated = localStorage.getItem('authToken');
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }

    nextTick(() =>{
        fetchProvinces()
    })
});
</script>
<template>
    <div class="wrapper">
        <div class="grid grid-row-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div v-for="(province, index) in data" :key="index" @click="goToDetail(province.id )" class="card">{{ province.name }}</div>
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