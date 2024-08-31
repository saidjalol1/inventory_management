<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);
const search = ref(props.modelValue || '');

// Emit the search query back to the parent
const onInput = () => {
  emit('update:modelValue', search.value);
};

const isSearchVisible = ref(false);
const isFilterVisible = ref(false);

const toggleSearch = () => {
    isSearchVisible.value = !isSearchVisible.value;
    if (isSearchVisible.value) {
        isFilterVisible.value = false; // Hide filter when search is active
    }
};

const toggleFilter = () => {
    isFilterVisible.value = !isFilterVisible.value;
    if (isFilterVisible.value) {
        isSearchVisible.value = false; // Hide search when filter is active
    }
};
</script>
<template>
    <div class="f flex justify-between mb-2">
            <div class="search-icon" @click="toggleSearch">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                </svg>
            </div>
            <input v-if="isSearchVisible"  v-model="search"  @input="onInput" type="text" class="search-input" placeholder="Qidiruv..."/>
            <div class="filter-drop" >
                <button @click="toggleFilter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-funnel" viewBox="0 0 16 16">
                        <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
                    </svg>
                </button>
               
            </div>
            
        </div>
       
        <div v-if="isFilterVisible" class="filter flex justify-around " >
            <div class="block1"><button>Joriy oy</button></div>
            <div class="block1"><button>Joriy yil</button></div>
            <div class="block1"><button>Joriy hafta</button></div>
        </div>
</template>
<style scoped>

.search-icon{
    cursor: pointer;
}
.filter-drop{
    cursor: pointer;
}
.search-input{
    position: absolute;
    outline: none;
    left: 90px;
    padding: 7px 0px 7px 20px;
    border-radius: 10px;
    width: 200px;
    height: 40px;
    background-color: white;

}
.f div{
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: white;
    -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    -moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    display: flex;
    justify-content: center;
    align-items: center;
}
.filter{
    position: sticky;
    top: 83px;
    font-size: 13px;
    display: flex;
    top: -100px;
    bottom: -100px;
    margin-bottom: 10px;
    right: 65px;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
}
.filter button{
    width:70px;
    background-color: white;
    -webkit-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    -moz-box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    box-shadow: -1px 2px 9px -1px rgba(184,182,184,1);
    border-radius: 10px;
    padding: 5px 2px;
}
</style>