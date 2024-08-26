<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const showProfileDropdown = ref(false);
const showFilterDropdown = ref(false);
const profileDropdownRef = ref(null);
const filterDropdownRef = ref(null);

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
        <div class="filter-drop" @click="toggleFilterDropdown">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
            <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
          </svg>
        </div>
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
  
  <transition name="fade">
    <div v-if="showFilterDropdown" ref="filterDropdownRef" class="filter">
      <div class="fblock1" type="button">Bugun</div>
      <div class="fblock1" type="button">Bu hafta</div>
      <div class="fblock1" type="button">Bu oy</div>
      <div class="fblock1" type="button">Bu yil</div>
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
