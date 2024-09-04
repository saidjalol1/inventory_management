<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black opacity-50 overflow-y-auto" @click="closeModal"></div>
      <div class="modal relative bg-white p-6 rounded shadow-lg max-w-lg w-full" @click.stop>
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-600 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <h2 class="text-lg font-semibold mb-4">Sotuv Qo'shish +</h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="province" class="block text-sm font-medium text-gray-700">Viloyat</label>
            <select id="province" v-model="selectedProvince" @change="fetchRegions" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select Province</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="region" class="block text-sm font-medium text-gray-700">Rayon</label>
            <select id="region" v-model="selectedRegion" @change="fetchShops" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select Region</option>
              <option v-for="region in regions" :key="region.id" :value="region.id">
                {{ region.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="shop" class="block text-sm font-medium text-gray-700">Klient</label>
            <select id="shop" v-model="sale.shop" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2">
              <option value="">Select Shop</option>
              <option v-for="shop in shops" :key="shop.id" :value="shop.id">
                {{ shop.name }}
              </option>
            </select>
          </div>
          <div class="mb-4">
            <label for="payment" class="block text-sm font-medium text-gray-700">To'lov</label>
            <input type="number" id="payment" v-model="sale.payment" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">QR Code Scan</label>
            <div id="qr-reader-video"  class="qr-reader-container w-full h-48 border border-gray-300 rounded-lg mt-1"></div>
            <button type="button" @click="toggleScanner" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              {{ scannerActive ? 'Stop Scanner' : 'Start Scanner' }}
            </button>
            <div class="mt-2">
              <label class="block text-sm font-medium text-gray-700">Scanned Data</label>
              <div v-for="(data, index) in scannedData" :key="index" class="mb-2 flex items-center">
                <input type="text" :placeholder="` Seriya raqam ${ data.product_id}`" v-model="data.product_id" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
                <input type="number" placeholder="Miqdori" v-model="data.quantity" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2 ml-2"/>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Save Sale</button>
          </div>
        </form>
      </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, nextTick, onUnmounted, watch } from 'vue';
  import { Html5Qrcode } from 'html5-qrcode';
  import { useRouter } from 'vue-router';
import { config } from "config"

const base = config.baseUrl
const router = useRouter();
  const props = defineProps({
    isOpen: Boolean
  });
  
  const emit = defineEmits(['close']);
  
  const provinces = ref([]);
  const regions = ref([]);
  const shops = ref([]);
  const selectedProvince = ref('');
  const selectedRegion = ref('');
  const error = ref('');
  const sale = ref({
    payment: '',
    shop: ''
  });
  const scannedData = ref([]); // Array to hold scanned data
  const scannerActive = ref(false); // State to manage QR code scanner
  
  let qrCodeScanner = null;
  

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
      console.log(base)
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
const fetchShop = async () => {
    try {
    const response = await fetch(`${base}/markets/region/get/${selectedRegion.value}`, {
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
    shops.value = data.markets
  } catch (error) {
    console.error(error);
    error.value = error
  }
}
  
  // Handle form submission
const handleSubmit = async () => {
  // Prepare the sale data according to the SaleCreate schema


  try {
    const response = await fetch(`${base}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payment: parseFloat(sale.value.payment),
        debt: 0, // Assuming debt is not provided in the form and should be set to 0 or another default value
        date_added: new Date().toISOString().split('T')[0], // Use today's date for example
        shop_id: parseInt(sale.value.shop),
        items: scannedData.value.map((data) => ({
          quantity: data.quantity, // Assuming a default quantity of 1 for each scanned item
          product_id: parseInt(data.product_id) // Map scanned data to product IDs (adjust as necessary)
        }))
      })
    });

    if (!response.ok) {
      console.log("Error status:", response.status);
      error.value = await response.text();
      const items =  scannedData.value.map((data) => ({
          quantity: data.quantity, // Assuming a default quantity of 1 for each scanned item
          product_id: parseInt(data.product_id) // Map scanned data to product IDs (adjust as necessary)
        }))
    console.log(items)
      return; // Exit function if response is not OK
    }

    const result = await response.json();
    console.log('Sale Created:', result);
    
    // Optionally handle the result or show a success message
    closeModal();
  } catch (error) {
    console.error('Submission Error:', error);
    error.value = 'An error occurred while creating the sale.';
  }
  closeModal();
};
  
  // Toggle QR code scanner
  const toggleScanner = () => {
    if (scannerActive.value) {
      stopScanner();
    } else {
      startScanner();
    }
  };
  
  // Start QR code scanner
  const startScanner = () => {
    const qrReaderElement = document.getElementById("qr-reader-video");
    if (qrReaderElement) {
      qrCodeScanner = new Html5Qrcode("qr-reader-video");
  
      qrCodeScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
          scannedData.value.push(decodedText);
        },
        (errorMessage) => {
          console.log(errorMessage);
        }
      ).catch((err) => {
        console.error(err);
      });
  
      scannerActive.value = true;
    } else {
      console.error("Element with ID 'qr-reader-video' not found.");
    }
  };
  
  // Stop QR code scanner
  const stopScanner = () => {
    if (qrCodeScanner && scannerActive.value) {
      qrCodeScanner.stop().then(() => {
        qrCodeScanner.clear();
        scannerActive.value = false;
      }).catch((err) => {
        console.error(err);
      });
    }
  };
  
  // Close modal
  const closeModal = () => {
    stopScanner(); // Ensure the scanner is stopped when the modal closes
    emit('close');
  };
  
  onMounted(async () => {
    await nextTick(); // Ensures that the DOM is updated
    // Start the scanner only if it's active
    if (scannerActive.value) {
      startScanner();
    }
    fetchProvinces()
  });
  
  onUnmounted(() => {
    stopScanner(); // Cleanup when the component is unmounted
  });
  
  watch(selectedProvince, fetchRegions);
  watch(selectedRegion, fetchShop);
  
  </script>
  
  <style scoped>
  .qr-reader-container {
  width: 100%; /* Full width, adjust as needed */
  max-width: 300px; /* Set a maximum width */
  height: auto; /* Maintain aspect ratio */
  aspect-ratio: 4 / 3; /* Maintain a specific aspect ratio */
  border: 2px solid #000; /* Optional: Add a border */
  margin: 0 auto; /* Center the container */
}

  video{
    width: 100%;
    height: 100%;
  }
  .modal{
    width: 400px;
    height: auto;
    overflow-y: auto;
    margin-top: 110px;
  }
  </style>
  