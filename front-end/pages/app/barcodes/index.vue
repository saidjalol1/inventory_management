<script setup>
import { ref, computed, nextTick, onUpdated } from 'vue';
import { useRouter } from 'vue-router';
import { config } from "config"

const base = config.baseUrl

const router = useRouter();
let isAuthenticated = ref(false);
const itemsPerPage = 10; // Number of items per page
const currentPage = ref(1);
const error = ref("")
const showModal = ref(false); // Modal visibility
const codes = ref([]);
const new_codes = ref("");
const searchQuery = ref("")


const fetchCodes = async () => {
    try {
    const response = await fetch(`${base}/qrcode/get/all`, {
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
    codes.value = data
    console.log(data)
  } catch (error) {
    console.error(error);
    error.value = error
  }
};

const addQRCode = async (event) => {
  event.preventDefault(); 
    try {
    const response = await fetch(`${base}/qrcode/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${isAuthenticated}`
      },
      body: JSON.stringify({
        number: new_codes.value,
      })
    });

    if (!response.ok) {
      console.log("Error status:", response.status);
      error.value =  await response.text()
      return; // Exit function if response is not OK
    }
    const data = await response.json();
    if (!data.error){
        new_codes.value = ""
    }
    await fetchCodes()
    console.log(data)
    error.value = data.error
  } catch (error) {
    console.error(error);
    error.value = error
  }
};

const deleteCode = async (code_id) => {
    try {
    const response = await fetch(`${base}/qrcode/delete/${code_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${isAuthenticated}`
      },
    });

    if (!response.ok) {
      console.log("Error status:", response.status);
      error.value =  await response.text()
      return; // Exit function if response is not OK
    }
    await fetchCodes()
  } catch (error) {
    console.error(error);
    error.value = error
  }
};

const filteredCodes = computed(() => {
  if (!searchQuery.value) {
    return codes.value;
  }
  return codes.value.filter(code =>
    code.number.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
// Compute paginated codes
const paginatedCodes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCodes.value.slice(start, end);
});

// Compute total number of pages
const totalPages = computed(() => Math.ceil(codes.value.length / itemsPerPage));

// Methods for pagination
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

const printCode = (index) => {
  const code = paginatedCodes.value[index];
  const printWindow = window.open('', '', 'height=600,width=800');

  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Code</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { padding: 20px; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${base}/${code.qr_code_image}" alt="Code Image" />
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }
};

const openModal = async () => {
  showModal.value = true;
  await fetchCodes()
};

const closeModal = async () => {
  showModal.value = false;
  await fetchCodes()
};


onMounted( async () => {
    isAuthenticated = localStorage.getItem('authToken');
    
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }
    await nextTick()
    fetchCodes()
});
</script>


<template>

  <div class="overflow-x-auto wrapper">
    <MenuFilter v-model="searchQuery"/>
    <div><p class="text-center text-red-600">{{ error }}</p></div>
    <table class="min-w-full bg-white shadow-md rounded-xl my-6">
      <thead class="rounded">
        <tr class="bg-green-400 text-white text-left rounded">
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tl-xl">Seriya raqam</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Chiqarish</th>
          <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">O'chirish</th>
        </tr>
      </thead>
      <tbody class="text-gray-700 rounded">
        <tr v-for="(code, index) in paginatedCodes" :key="index" class="hover:bg-green-100 border-b border-gray-200">
          <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">{{ code.number }}</td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">
            <button @click="printCode(code.id)" aria-label="Print Code">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
              </svg>
            </button>
          </td>
          <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm cursor-pointer">
            <button @click="deleteCode(code.id)" aria-label="Delete Code">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16">
                <path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="paginate flex justify-between items-center mt-4">
    <button
      @click="prevPage"
      :disabled="currentPage === 1"
      class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
      aria-label="Previous Page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 0 0-.707-.707l-4 4a.5.5 0 0 0 0 .707l4 4a.5.5 0 0 0 .707-.707L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
    </button>
    <span>{{ currentPage }} / {{ totalPages }}</span>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
      aria-label="Next Page"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5.5h11.293l-3.147 3.146a.5.5 0 0 1 .707.707l4-4a.5.5 0 0 1 0-.707l-4-4a.5.5 0 0 1-.707.707L12.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
      </svg>
    </button>
  </div>
  <button @click="openModal" class="plus text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
    </button>
  <!-- Modal for adding QR codes -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="modal-overlay absolute inset-0 bg-gray-600 bg-opacity-75"></div>
      <div class="modal-container bg-white p-6 rounded-lg shadow-lg z-10">
        <h3 class="text-xl font-semibold mb-4">Qr code yaratish</h3>
        <form @submit.prevent="addQRCode">
          <div class="mb-4">
            <label for="code" class="block text-sm font-medium text-gray-700">Seriya raqam</label>
            <input
              v-model="new_codes"
              type="text"
              id="code"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              required
            />
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Yopish
            </button>
            <button
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
</template>


<style scoped>
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

button svg {
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
