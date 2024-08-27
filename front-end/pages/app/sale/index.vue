<script setup>
import { ref, computed } from 'vue';
const isModalOpen = ref(false);

const openModal = () => {
    isModalOpen.value = true;
};

</script>
<template>
    <div class="wrapper">
    <MenuFilter />
    <Table />
    <SaleModal :isOpen="isModalOpen" @close="isModalOpen = false" />
    <button @click="openModal" class="plus text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
    </button>
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
</style>
