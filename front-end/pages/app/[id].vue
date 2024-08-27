<template>
  <div class="print-page">
    <header>
      <div class="container">
        <div>
          от << _____ >> _____________ 201 ____ г.
        </div>
      </div>
    </header>
    <main>
      <div class="container">
        <div class="title">
          Накладная No {{ sale.id }}
        </div>
        <div class="name_surname">
          Кому : {{ sale.shop.name }} {{ sale.shop.last_name }}
        </div>
        <div class="other_data">
          От кого
        </div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Наименование</th>
              <th>Ед.изм</th>
              <th>Цена</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item.id">
              <td>{{ index + 1 }}</td>
              <td>{{ item.product.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatPrice(item.product.sale_price) }}</td>
              <td>{{ formatPrice(item.product.sale_price * item.quantity) }}</td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="5">No items available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    <footer>
      <div class="container">
        <div>
          Cдал:______  ________________ 
        </div>
        <div>
          Принял:_____  ________________ 
        </div>
      </div>
      
    </footer>
    <div class="container">
        <button class="no-print" @click="printPage">Print</button>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Mock data
const sale = ref({
  id: 2,
  shop: {
    name: 'Shop Name',
    last_name: 'Shop Last Name'
  },
})

const items = ref([
  {
    id: 1,
    product: {
      name: 'Product 1',
      sale_price: 10000
    },
    quantity: 1
  },
  {
    id: 2,
    product: {
      name: 'Product 2',
      sale_price: 5000
    },
    quantity: 2
  }
])

function formatPrice(price) {
  return new Intl.NumberFormat().format(price)
}

function printPage() {
  window.print()
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  padding: 0 5%;
  max-width: 1240px;
  overflow-x: hidden;
}
header, footer {
  padding: 2% 5%;
  display: flex;
  justify-content: space-between;
}
.title {
  text-align: center;
  font-size: 14px;
}
.name_surname {
  margin-top: 20px;
  margin-bottom: 20px;
}
.other_data {
  margin-bottom: 20px;
}
table {
  width: 100%;
  border: 1px solid black;
  border-collapse: collapse;
  margin: 0 auto;
}
th {
  border: 1px solid black;
}
td {
  border: 1px solid black;
}
@media print {
  body {
    font-family: Arial, sans-serif;
  }
  .no-print {
    display: none;
  }
  .print-only {
    display: block;
  }
}
button{
  background-color: rgb(12, 231, 12);
  border-radius: 10px;
  color: white;
  padding: 10px 20px;
}
</style>
