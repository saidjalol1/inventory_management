<script setup>
import { config } from 'config';
import { onMounted, ref, watch } from 'vue';

const base = config.baseUrl;
const obj = ref([]); // Reactive reference to store fetched data

// Chart options configuration
const chartOptions = {
  chart: {
    id: 'bar-example',
  },
  xaxis: {
    categories: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"],
  },
};

// Series data for the chart, initially empty
const series = ref([]);

// Function to fetch data from the server
const fetchData = async () => {
  try {
    const response = await fetch(`${base}/statistics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const objs = await response.json();
    console.log(objs.sales_chart.series);
    
    // Update the reactive reference with fetched data
    obj.value = objs.sales_chart;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

watch(obj, (newObj) => {
  if (newObj.series && newObj.series && newObj.series) {
    series.value = newObj.series;
  } else {
    console.error('Series data is not available:', newObj);
  }
});
// Fetch data when the component is mounted
onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <apexchart height="300" type="bar" :options="chartOptions" :series="series"></apexchart>
</template>
