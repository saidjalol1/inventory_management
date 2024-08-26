<script setup>
const chartOptions = {
  chart: {
    id: 'bar-example',
  },
  xaxis: {
    categories: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust","Sentyabr","Oktyabr","Noyabr","Dekabr"],
  },
};
const series = [
  {
    name: 'series-1',
    data: [30, 40, 35, 50, 49, 60, 70, 91],
  },
];
</script>

<template>
    <apexchart height="400"  type="bar" :options="chartOptions" :series="series"></apexchart>
</template>
  