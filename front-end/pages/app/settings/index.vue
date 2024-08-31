<script setup>
import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { config } from "config"

const base = config.baseUrl
const router = useRouter();
let isAuthenticated = ref("");




const provinces = ref([]);
const regions = ref([]);
const form1 = ref(false);
const form2 = ref(true);
let error = ref('')
const selectedProvince = ref('');
const selectedRegion = ref('');


const regionname = ref("")
const clientname = ref("")
const clientsurname = ref("")

const fetchProvinces = async () => {
    try {
    const response = await fetch(`${base}/markets/province/get/`, {
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
    provinces.value = data
  } catch (error) {
    console.error(error);
    error.value = error
  }
};

const fetchRegions = async () => {
    try {
    const response = await fetch(`${base}/markets/regions/get/${selectedProvince.value}`, {
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
    regions.value = data
  } catch (error) {
    console.error(error);
    error.value = error
  }
}

const addRegion = async (event) => {
    event.preventDefault(); 
    try {
    const response = await fetch(`${base}/markets/region/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${isAuthenticated}`
      },
      body: JSON.stringify({
        name: regionname.value,
        province_id: selectedProvince.value
      })
    });

    if (!response.ok) {
      console.log("Error status:", response.status);
      error.value =  await response.text()
      return; // Exit function if response is not OK
    }
    const data = await response.json();
    if (!data.error){
        regionname.value = ""
        selectedProvince.value = ""
    }
    console.log(data)
    error.value = data.error
    

  } catch (error) {
    console.error(error);
    error.value = error
  }
};

const addShop = async (event) => {
    event.preventDefault(); 
    try {
    const response = await fetch(`${base}/markets/market/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${isAuthenticated}`
      },
      body: JSON.stringify({
        name: clientname.value + " " + clientsurname.value,
        region_id: selectedRegion.value
      })
    });

    if (!response.ok) {
      console.log("Error status:", response.status);
      error.value =  await response.text()
      return; // Exit function if response is not OK
    }

    const data = await response.json();
    if (!data.error){
        clientname.value = ""
        clientsurname.value = ""
        selectedProvince.value = ""
        selectedRegion.value = ""
    }
    console.log(data)
    error.value = data.error
   

  } catch (error) {
    console.error(error);
    error.value = error
  }
};

const form1show = () =>{
    form1.value = !form1.value
    form2.value = false
}
const form2show = () =>{
    form1.value = false
    form2.value = !form2.value

}
onMounted( async () => {
    isAuthenticated = localStorage.getItem('authToken');
    
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }
    nextTick(() => {
        fetchProvinces();
    });
    
});


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
        <div>
            <p class="text-red-500 text-center mt-10">{{ error }}</p>
        </div> 
        <div class="forms grid grid-row-1 grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-2 gap-2">
            <div v-if="form1" class="form1 px-5 mt-10">
                <form @submit="addRegion">
                    <div class="mb-4">
                        <label for="quantity" class="block text-sm font-medium text-gray-700">Viloyat</label>
                        <select id="province" v-model="selectedProvince" v-on:change="fetchRegions"  class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
                            <option value="">Viloyatni tanlang</option>
                            <option v-for="province in provinces" :key="province.id" :value="province.id">
                                {{ province.name }}
                            </option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label for="payment" class="block text-sm font-medium text-gray-700">Tuman</label>
                        <input type="text" v-model="regionname" id="payment"  class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Saqlash</button>
                        <button @click="closeModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Yopish</button>
                    </div>
                </form>
            </div>
            <div v-if="form2" class="form2 px-5 mt-10">
                <form @submit="addShop">
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
                        <input type="text" v-model="clientname" id="payment"  class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
                    </div>
                    <div class="mb-4">
                        <label for="payment" class="block text-sm font-medium text-gray-700">Familiya</label>
                        <input type="text" v-model="clientsurname" id="payment"  class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
                    </div>
                    <div class="flex justify-end">
                        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Saqlash</button>
                        <button @click="closeModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Yopish</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  
</template>
<style scoped>
.form1,.form2{
    background-color: white;
    border-radius: 10px;
    padding: 25px;
    -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    -moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
}
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