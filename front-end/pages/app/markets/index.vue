<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goToDetail = (index) => {
  router.push(`/app/markets/${index}`);
};
const data = ref([
    {name:"Andijon"},
    {name:"Farg'ona"},
    {name:"Buxoro"},
    {name:"Jizzax"},
    {name:"Qaraqalpaqstan"},
    {name:"Qashqadaryo"},
    {name:"Navoiy"},
    {name:"Namangan"},
    {name:"Samarqand"},
    {name:"Sirdaryo"},
    {name:"Surxondaryo"},
    {name:"Toshkent"},
])
</script>
<template>
    <div class="wrapper">
        <div class="grid grid-row-1 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div v-for="(province, index) in data" :key="index" @click="goToDetail(index)" class="card">{{ province.name }}</div>
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