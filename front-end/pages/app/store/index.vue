<script setup>
import { onMounted, ref } from "vue"
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'vue-router';
import { config } from "config"

const base = config.baseUrl
const router = useRouter();
let isAuthenticated = ref("");
let error = ref("");

const store = ref(true)
const tranzactions = ref(false)
const products = ref(false)
const plusBtn = ref(true)
const productAdd = ref(false)
const storeAdd = ref(false)
const searchQuery = ref("")

const storeData = ref([])
const tranzactionsData = ref([])
const productsData = ref([])
const productData = ref({})
const storeProduct = ref({})

const scannedData = ref(""); // Array to hold scanned data
const scannerActive = ref(false); // State to manage QR code scanner
  
let qrCodeScanner = null;

const itemsPerPage = 10; // Number of items per page
const currentPage = ref(1);


const toggleScanner = () => {
    if (scannerActive.value) {
      stopScanner();
    } else {
      startScanner();
    }
  };

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
          scannedData.value = decodedText;
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
  
const stopScanner = () => {
    if (qrCodeScanner) {
      qrCodeScanner.stop().then(() => {
        qrCodeScanner.clear();
        scannerActive.value = false;
      }).catch((err) => {
        console.error(err);
      });
    }
  };
onMounted(async () => {
    isAuthenticated = localStorage.getItem('authToken');
    
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }
    await nextTick(); // Ensures that the DOM is updated
    // Start the scanner only if it's active
    if (scannerActive.value) {
      startScanner();
    }
    fetchStore()
  });
  
onUnmounted(() => {
    stopScanner(); // Cleanup when the component is unmounted
  });
const toggleStore = () =>{
  store.value = !store.value
  tranzactions.value = false
  products.value = false
  plusBtn.value = true
}

const fetchStore = async () =>{
  try {
      const response = await fetch(`${base}/store/`, {
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
      storeData.value = objs
      console.log(objs, "lkjlk")
    } catch (error) {
      console.error(error);
      error.value = error
    }
}

const fetchTranzactions = async () =>{
    tranzactions.value =  true
    plusBtn.value = false
    store.value = false
    products.value = false
    try {
      const response = await fetch(`${base}/tranzactions/`, {
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
      tranzactionsData.value = objs
      console.log(objs)
    } catch (error) {
      console.error(error);
      error.value = error
    }
}

const fetchproducts = async () =>{
    products.value = true
    plusBtn.value = true
    store.value = false
    tranzactions.value = false
    try {
      const response = await fetch(`${base}/products/`, {
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
      productsData.value = objs
    } catch (error) {
      console.error(error);
      error.value = error
    }
}

const addProduct = async (event) => {
      event.preventDefault(); 
      try {
      const response = await fetch(`${base}/products/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${isAuthenticated}`
        },
        body: JSON.stringify({
          name: productData.value.name,
          base_price: productData.value.base_price,
          sale_price: productData.value.sale_price,
          qr_code_id :  productData.value.qr_code_id
        })
      });

      if (!response.ok) {
        console.log("Error status:", response.status);
        error.value =  await response.text()
        return; // Exit function if response is not OK
      }
      const data = await response.json();
      if (!data.error){
          productData.value = {}
      }
      console.log(data)
      error.value = data.error
      await fetchproducts()
    } catch (error) {
      console.error(error);
      error.value = error
    }
  };
const addStore = async (event) => {
      event.preventDefault(); 
      try {
      const response = await fetch(`${base}/tranzactions/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${isAuthenticated}`
        },
        body: JSON.stringify({
          qr_code_id: storeProduct.value.qr_code_id,
          amount: storeProduct.value.amount
        })
      });

      if (!response.ok) {
        console.log("Error status:", response.status);
        error.value =  await response.text()
        return; // Exit function if response is not OK
      }
      const data = await response.json();
      if (!data.error){
          productData.value = {}
      }
      console.log(data)
      error.value = data.error
      fetchStore()
    } catch (error) {
      console.error(error);
      error.value = error
    }
  };

const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return productsData.value
  } else {
    return productsData.value.filter(code =>
      code.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  }
});

const filteredStore = computed(() => {
  if (!searchQuery.value) {
    return storeData.value
  } else {
    return storeData.value.filter(code =>
      code.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  }
});

const filteredTranzactions = computed(() => {
  if (!searchQuery.value) {
    return tranzactionsData.value
  } else {
    return tranzactionsData.value.filter(code =>
      code.product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  }
});

const paginatedStoreProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredStore.value.slice(start, end);
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

const paginatedTranzactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTranzactions.value.slice(start, end);
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
const f = ref(false)
</script>
<template>
<div class="wrapper">
  <MenuFilter v-model="searchQuery" :f="f"/>
  <div>
    <p class="mt-4 mb-4 text-red-500 text-center">{{ error }}</p>
  </div>
        <div class="header  grid grid-row-1 grid-cols-3 justify-center">
            <div class="flex flex-col items-center justify-center gap-y-2">
                <button @click="toggleStore" :class="{ color: store }" class="text-gray-500 text-center text-xs">Omborda</button>
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
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Nomi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Miqdori</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Tan narxi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Sotuv Narxi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold rounded-tr-xl">Jami summa</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(product, index) in paginatedStoreProducts" :key="index" class="hover:bg-green-100 border-b border-gray-200">
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
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold rounded-tl-xl">Seriya</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Nomi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Miqdori</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Sana</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(product, index) in paginatedTranzactions" :key="index" class="hover:bg-green-100 border-b border-gray-200">
          <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.product.qr_code_id }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.product.name }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.tranzaction_type === "add" ? "- " : "+ " }}{{ product.amount }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.date }}</td>
        </tr>
      </tbody>
    </table>
    <table v-if="products" class="min-w-full bg-white shadow-md rounded-xl my-6">
      <thead class="rounded">
        <tr class="bg-green-400 text-white text-left rounded">
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold rounded-tl-xl">Seriya raqam</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Nomi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Tan narxi</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-xs uppercase font-semibold">Sotuv narxi</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(product, index) in paginatedProducts" :key="index" class="hover:bg-green-100 border-b border-gray-200">
          <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ product.qr_code_id }}</td>
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
          <form @submit="addProduct">
            <div class="mb-4">
            <div id="qr-reader-video"  class="qr-reader-container w-full h-48 border border-gray-300 rounded-lg mt-1"></div>
            <button type="button" @click="toggleScanner" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              {{ scannerActive ? 'To\'tatish' : 'Skayner boshlash' }}
            </button>
            <div class="mt-2">
              <label class="block text-sm font-medium text-gray-700">Seriya raqam</label>
              <div class="mb-2">
                <input type="text"  :placeholder="'Skaynerlandi ' + ( scannedData)" v-model="productData.qr_code_id" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label for="newName" class="block text-sm font-medium text-gray-700">Nomi</label>
            <input type="text" id="newName" v-model="productData.name" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newAmount" class="block text-sm font-medium text-gray-700">Tan Narxi</label>
            <input  type="number" id="newAmount" v-model="productData.base_price" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newDate" class="block text-sm font-medium text-gray-700">Sotuv Narxi</label>
            <input  type="Number" id="newDate" v-model="productData.sale_price" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="flex justify-end">
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Saqlash</button>
            <button @click="closeModal(0)" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Yopish</button>
          </div>
          </form>
        </div>
    </div>
    <div v-if="storeAdd" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-0">
          <h3 class="text-lg font-semibold mb-4">Mahsulot Kiritish</h3>
        <form @submit="addStore">
          <div class="mb-4">
            <div id="qr-reader-video"  class="qr-reader-container w-full h-48 border border-gray-300 rounded-lg mt-1"></div>
            <button type="button" @click="toggleScanner" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">
              {{ scannerActive ? 'To\'tatish' : 'Skayner boshlash' }}
            </button>
            <div class="mt-2">
              <label class="block text-sm font-medium text-gray-700">Seriya Raqam</label>
              <div  class="mb-2">
                <input type="text" :placeholder="scannedData" v-model="storeProduct.qr_code_id" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
              </div>
            </div>
            <div class="mt-2">
              <label class="block text-sm font-medium text-gray-700">Miqdori</label>
              <div  class="mb-2">
                <input type="number" v-model="storeProduct.amount" class="mt-1 block w-full border border-gray-300 rounded px-3 py-2"/>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="closeModal(1)"  class="bg-gray-500 text-white px-4 py-2 mr-4 rounded">Yopish</button>
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">saqlash</button>
          </div>
        </form>
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
.qr-reader-container {
  width: 100%; /* Full width, adjust as needed */
  max-width: 300px; /* Set a maximum width */
  height: auto; /* Maintain aspect ratio */
  aspect-ratio: 4 / 3; /* Maintain a specific aspect ratio */
  border: 2px solid #000; /* Optional: Add a border */
  margin: 0 auto; /* Center the container */
}
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