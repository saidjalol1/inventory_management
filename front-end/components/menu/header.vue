<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showProfileDropdown = ref(false);
const showFilterDropdown = ref(false);
const filterDropdownRef = ref(null);
const profileDropdownRef = ref(null);

const toggleProfileDropdown = (event) => {
  event.stopPropagation();
  showProfileDropdown.value = !showProfileDropdown.value;
  showFilterDropdown.value = false; // Close the filter dropdown when the profile dropdown is opened
};

const toggleFilterDropdown = (event) => {
  event.stopPropagation();
  showFilterDropdown.value = !showFilterDropdown.value;
  showProfileDropdown.value = false; // Close the profile dropdown when the filter dropdown is opened
};

const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    showProfileDropdown.value = false;
  }
  if (filterDropdownRef.value && !filterDropdownRef.value.contains(event.target)) {
    showFilterDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="menu">
    <ul>
      <li class="logo">
        <NuxtLink to="/">
          <img src="public/favicon.ico" alt="Logo">
        </NuxtLink>
      </li>
      <li class="second">
        <li class="profile" @click="toggleProfileDropdown">
          <img src="/public/user-profile-icon-vector-avatar-600nw-2247726673.webp" alt="Profile">
        </li>
      </li>
    </ul>
    
  </div>
  
  <transition name="fade">
    <div v-if="showProfileDropdown" ref="profileDropdownRef" class="pdrop">
      <DropdownsProfileDropDown />
    </div>
  </transition>
</template>

<style scoped>
/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.menu {
  width: 100%;
  padding: 0 20px;
  background-color: white;
  -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
-moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
}
.menu ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
}
.logo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.second {
  display: flex;
  column-gap: 20px;
  align-items: center;
}
.profile {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.filter-drop {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}
.filter-drop:hover {
  color: rgb(135, 245, 135);
  cursor: pointer;
}
.filter {
  width: 100%;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  border-radius: 10px;
}
.filter .fblock1 {
  width: 100%;
  padding: 5px;
  text-align: center;
  font-size: 12px;
  background-color: white;
  color: rgb(102, 101, 101);
}
.fblock1:hover {
  color: rgb(135, 245, 135);
  cursor: pointer;
  background-color: aliceblue;
}
</style>
