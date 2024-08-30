<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let isAuthenticated = ref("");

onMounted(() => {
    isAuthenticated = localStorage.getItem('authToken');
    
    if (!isAuthenticated || isAuthenticated == "undefined" || isAuthenticated === null) {
        router.push('/login'); // Redirect to login if not authenticated
    }
});

const expenses = ref([
  { name: 'Expense 1', amount: 2, date: '2024-08-27' },
  // Add more sample expenses here
]);

const itemsPerPage = 10; // Number of items per page
const currentPage = ref(1);

// Modal control and data
const showModal = ref(false);
const addModal = ref(false);
const selectedExpense = ref(null);
const newExpense = ref({
  name: '',
  amount: 0,
  date: ''
});

// Compute paginated expenses
const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return expenses.value.slice(start, end);
});

// Compute total number of pages
const totalPages = computed(() => Math.ceil(expenses.value.length / itemsPerPage));

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

// Open the modal for editing
const editExpense = (expense) => {
  selectedExpense.value = { ...expense };
  showModal.value = true;
};

// Open the modal for adding a new expense
const openAddModal = () => {
  newExpense.value = { name: '', amount: 0, date: '' };
  addModal.value = true;
};

// Save the edited expense
const saveExpense = () => {
  if (selectedExpense.value) {
    const index = expenses.value.findIndex(exp => exp === selectedExpense.value);
    if (index !== -1) {
      expenses.value[index] = { ...selectedExpense.value };
    }
  }
  closeModal();
};

// Save the new expense
const saveNewExpense = () => {
  if (newExpense.value.name && newExpense.value.amount > 0 && newExpense.value.date) {
    expenses.value.push({ ...newExpense.value });
  }
  closeAddModal();
};

// Close the edit modal
const closeModal = () => {
  showModal.value = false;
  selectedExpense.value = null;
};

// Close the add modal
const closeAddModal = () => {
  addModal.value = false;
};
</script>


<template>
    <div class="wrapper">
      <MenuFilter />
      <table class="min-w-full bg-white shadow-md rounded-xl my-6">
        <thead class="rounded">
          <tr class="bg-green-400 text-white text-left rounded">
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tl-xl">Name</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Amount</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Date</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700 rounded">
          <tr v-for="(expense, index) in paginatedExpenses" :key="index" class="hover:bg-green-100 border-b border-gray-200">
            <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ expense.name }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ expense.amount }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ expense.date }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">
              <div class="flex flex-col sm:flex-row">
                <button @click="editExpense(expense)" class="text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
                  <!-- Edit icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
  
      <!-- Edit Expense Modal -->
      <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-0">
          <h3 class="text-lg font-semibold mb-4">Edit Expense</h3>
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="selectedExpense.name" type="text" id="name" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
            <input v-model="selectedExpense.amount" type="number" id="amount" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="selectedExpense.date" type="date" id="date" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="flex justify-end">
            <button @click="saveExpense" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button @click="closeModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
  
      <!-- Add Expense Modal -->
      <div v-if="addModal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="fixed inset-0 bg-black opacity-50"></div>
        <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-0">
          <h3 class="text-lg font-semibold mb-4">Add Expense</h3>
          <div class="mb-4">
            <label for="newName" class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="newExpense.name" type="text" id="newName" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newAmount" class="block text-sm font-medium text-gray-700">Amount</label>
            <input v-model="newExpense.amount" type="number" id="newAmount" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="mb-4">
            <label for="newDate" class="block text-sm font-medium text-gray-700">Date</label>
            <input v-model="newExpense.date" type="date" id="newDate" class="mt-1 p-2 w-full border rounded">
          </div>
          <div class="flex justify-end">
            <button @click="saveNewExpense" class="bg-green-500 text-white px-4 py-2 rounded mr-2">Saqlash</button>
            <button @click="closeAddModal" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">Yopish</button>
          </div>
        </div>
      </div>
  
      
     <button @click="openAddModal" class="plus text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
             <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
         </svg>
     </button>
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
  