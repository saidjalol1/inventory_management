<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isLoginPage = computed(() => {
  return route.path === '/login';
});
</script>
<template>
  
  <MenuHeader v-if="!isLoginPage"/>
  <div class="wrapper">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <Menu v-if="!isLoginPage"/>
</template>

<style scoped>
.wrapper{
  max-width: 1920px;
  padding: 5px 5px;
}
</style>
