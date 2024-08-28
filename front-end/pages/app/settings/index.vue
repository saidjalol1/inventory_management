<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue';

const provinces = ref([]);
const regions = ref([]);
const form1 = ref(false);
const form2 = ref(false);
const selectedProvince = ref('');
const selectedRegion = ref('');

const fetchProvinces = async () => {
    provinces.value = [
      { id: '1', name: 'Province 1' },
      { id: '2', name: 'Province 2' }
    ];
};

const fetchRegions = async () => {
    console.log("print")
    if (selectedProvince.value){
        regions.value = [
            {id:1,name: "Region 1"},
            {id:1,name: "Region 2"},
            {id:1,name: "Region 3"},
        ]
    }
}

const form1show = () =>{
    form1.value = !form1.value
    form2.value = false
    span = document.getElementById("span1")
    span.class = "color"
}
const form2show = () =>{
    form1.value = false
    form2.value = !form2.value
    span = document.getElementById("span1")
    span.class = "color"
}

fetchProvinces()
</script>
<template>
    <div class="wrapper">
        <div class="header">
            <div class="men grid grid-row-1 grid-cols-2  gap-2">
                <div class="text-center text-gray-600 flex flex-col px-3">
                    <button @click="form1show" :class="{ color:form1 }">Tuman qo'shish</button>
                    <span id="span1" v-show="form1"></span>
                </div>
                <div class="text-center text-gray-600 flex flex-col px-3">
                    <button @click="form2show" :class="{ color:form2 }">Do'kon qo'shish</button>
                    <span class="span2" v-show="form2"></span>
                </div>
            </div>
        </div>
        <div class="forms grid grid-row-1 grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-2 gap-2">
            <div v-if="form1" class="form1 px-5 mt-10">
                <form action="">
                    <div class="mb-4">
                        <label for="quantity" class="block text-sm font-medium text-gray-700">Viloyat</label>
                        <select id="province" @change="fetchProvinces" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
                            <option value="">Viloyatni tanlang</option>
                            <option v-for="province in provinces" :key="province.id" :value="province.id">
                                {{ province.name }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="payment" class="block text-sm font-medium text-gray-700">Tuman</label>
                        <input type="text" id="payment"  class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
                    </div>
                    <div class="flex justify-end">
                        <button @click="savePayment" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
                        <button @click="closeModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                    </div>
                </form>
            </div>
            <div v-if="form2" class="form2 px-5 mt-10">
                <form action="">
                    <div class="mb-4">
                        <label for="quantity" class="block text-sm font-medium text-gray-700">Viloyat</label>
                        <select id="province" v-model="selectedProvince" @change="fetchRegions" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
                            <option value="">Viloyatni tanlang</option>
                            <option v-for="province in provinces" :key="province.id" :value="province.id">
                                {{ province.name }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="payment" class="block text-sm font-medium text-gray-700">Tuman</label>
                        <select id="province" v-model="selectedRegion" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
                            <option value="">Tumanni tanlang</option>
                            <option v-for="region in regions" :key="region.id" :value="region.id">
                                {{ region.name }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="payment" class="block text-sm font-medium text-gray-700">Ism</label>
                        <input type="text" id="payment"  class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
                    </div>
                    <div class="mb-4">
                        <label for="payment" class="block text-sm font-medium text-gray-700">Familiya</label>
                        <input type="text" id="payment"  class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
                    </div>
                    <div class="flex justify-end">
                        <button @click="savePayment" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
                        <button @click="closeModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<style scoped>
.header{
    width: 100%;
}
.color{
    color: rgb(60, 235, 60);
}
.men div span{
    width: 100%;
    border: 1px solid  rgb(60, 235, 60);
    margin-top: 10px;
}
</style>