<template>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow-md rounded my-6">
        <thead>
          <tr class="bg-gray-800 text-white text-left">
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Ismi</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">To'lov</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Qarz</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Jami</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Sanasi</th>
            <th class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm uppercase font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="(sale, index) in sales" :key="index" class="hover:bg-gray-100 border-b border-gray-200">
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.product }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.quantity }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.price }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.total }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">{{ sale.date }}</td>
            <td class="py-2 px-3 text-xs sm:py-3 sm:px-4 sm:text-sm">
              <div class="flex flex-col sm:flex-row">
                <button @click="editSale(sale)" class="bg-blue-500 text-white px-2 py-1 rounded mb-1 sm:mb-0 sm:mr-2 text-xs sm:text-sm">
                  Edit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const sales = ref([
    { product: 'Product 1', quantity: 2, price: 100, total: 200, date: '2024-08-27' },
    { product: 'Product 2', quantity: 1, price: 150, total: 150, date: '2024-08-27' },
    // Add more sample sales data here
  ]);
  
  const editSale = (sale) => {
    alert(`Editing sale for ${sale.product}`);
  };
  
  const deleteSale = (sale) => {
    if (confirm(`Are you sure you want to delete the sale for ${sale.product}?`)) {
      sales.value = sales.value.filter(s => s !== sale);
    }
  };
  </script>
  
  <style scoped>
  .table-row {
    transition: background-color 0.3s ease;
  }
  </style>
  