<script setup>
import { config } from 'config';
import { onMounted } from 'vue';
const base = config.baseUrl;

const chartOptions = {
  chart: {
    id: 'bar-example',
  },
  xaxis: {
    categories: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust","Sentyabr","Oktyabr","Noyabr","Dekabr"],
  },
};
let series = [{
  name : "Sotuv",
  data : []
}];
const fetchData = async () => {
  try {
    const response = await fetch(`${base}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },      
    });
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const objs = await response.json()
    series[0].data = objs.sales_chart.series[0].data
    console.log(objs.sales_chart.series[0].data)
    console.log(series)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
onMounted(async () =>{
  await fetchData()
})
</script>

<template>
    <apexchart height="300"  type="bar" :options="chartOptions" :series="series"></apexchart>
</template>
  