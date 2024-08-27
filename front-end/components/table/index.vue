<script setup>
  import { ref, computed } from 'vue';
  const isModalOpen = ref(false);

  const openModal = () => {
  isModalOpen.value = true;
};
  const sales = ref([
    { product: 'Product 1', quantity: 2, price: 100, total: 200, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    // Add more sample sales data here
  ]);
  
  const itemsPerPage = 10; // Number of items per page
  const currentPage = ref(1);
  
  // Compute paginated sales
  const paginatedSales = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sales.value.slice(start, end);
  });
  
  // Compute total number of pages
  const totalPages = computed(() => Math.ceil(sales.value.length / itemsPerPage));
  
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
  
  const editSale = (sale) => {
    alert(`Editing sale for ${sale.product}`);
  };
  </script>
<template>
    <div class=" t overflow-x-auto">
      <table class="min-w-full bg-white shadow-md rounded my-6">
        <thead>
          <tr class="bg-green-400 text-white text-left ">
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tl-xl">Ismi</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">To'lov</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Qarz</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Jami</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Sanasi</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold rounded-tr-xl">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="(sale, index) in paginatedSales" :key="index" class="hover:bg-green-100 border-b border-gray-200">
            <td class="py-2 px-4 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.product }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.quantity }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.price }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.total }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.date }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">
              <div class="flex flex-col sm:flex-row">
                    <button @click="editSale(sale)" class="text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
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
            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
        </svg>
        </button>
    </div>
      
    </div>
    
    
    <button @click="openModal" class="plus text-gray-800 px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
    </button>
    <SaleModal :isOpen="isModalOpen" @close="isModalOpen = false" />
  </template>
  

  
<style scoped>
.t{
  display: flex;
  flex-direction: column;
}
  table{
    border-radius: 10px;
  }
  .table-row {
    transition: background-color 0.3s ease;
  }
  .paginate{
    width: 100%;
    display: flex;
    justify-content: center;
    column-gap: 50px;
    margin-bottom: 80px;
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
  