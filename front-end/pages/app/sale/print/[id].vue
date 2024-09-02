<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { config } from 'config'
const base = config.baseUrl
const route = useRoute()
const saleId = route.params.id

const sale = ref({})
const error = ref('')

const fetchSale = async () => {
  try {
    const response = await fetch(`${base}/sales/${saleId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      console.error("Error status:", response.status)
      error.value = await response.text()
      return
    }

    const data = await response.json()
    sale.value = data
    console.log(data)
  } catch (err) {
    console.error(err)
    error.value = err.message
  }
}

// Function to print the page
function printPage() {
  window.print()
}

function formatPrice(price) {
  return new Intl.NumberFormat().format(price)
}
onMounted(() =>{
  fetchSale()
})
</script>
<template>
  <div v-if="sale.id" class="print-page">
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
          Кому : {{ sale.shop.name }}
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
            <tr v-for="(item, index) in sale.items" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.product.name }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatPrice(item.product.sale_price) }}</td>
              <td>{{ formatPrice(item.product.sale_price * item.quantity) }}</td>
            </tr>
            <tr v-if="sale.length === 0">
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
  <div v-else>
    <p>Loading ...</p>
  </div>
</template>
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
